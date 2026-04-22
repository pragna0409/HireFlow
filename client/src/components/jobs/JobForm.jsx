import { useState } from 'react';
import { Save, X } from 'lucide-react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { JOB_TYPES, EXPERIENCE_LEVELS, CURRENCIES } from '../../utils/constants';

const empty = {
  title: '',
  company: '',
  location: '',
  jobType: 'full-time',
  experienceLevel: 'mid',
  salaryMin: '',
  salaryMax: '',
  currency: 'USD',
  description: '',
  responsibilities: '',
  skills: '',
};

export default function JobForm({ initial, onSubmit, submitting, onCancel }) {
  const [values, setValues] = useState(() => {
    if (!initial) return empty;
    return {
      ...empty,
      ...initial,
      skills: Array.isArray(initial.skills) ? initial.skills.join(', ') : initial.skills || '',
      responsibilities: Array.isArray(initial.responsibilities)
        ? initial.responsibilities.join('\n')
        : initial.responsibilities || '',
    };
  });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => {
    const val = e?.target ? e.target.value : e;
    setValues((v) => ({ ...v, [k]: val }));
    setErrors((err) => ({ ...err, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!values.title.trim()) e.title = 'Title is required';
    if (!values.description.trim() || values.description.trim().length < 20)
      e.description = 'Description must be at least 20 characters';
    if (!values.location.trim()) e.location = 'Location is required';
    if (values.salaryMin && values.salaryMax && Number(values.salaryMin) > Number(values.salaryMax))
      e.salaryMax = 'Max must be greater than min';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const payload = {
      ...values,
      salaryMin: values.salaryMin ? Number(values.salaryMin) : undefined,
      salaryMax: values.salaryMax ? Number(values.salaryMax) : undefined,
      skills: values.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      responsibilities: values.responsibilities
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Job title"
          required
          value={values.title}
          onChange={set('title')}
          placeholder="e.g. Senior Frontend Engineer"
          error={errors.title}
        />
        <Input
          label="Company"
          value={values.company}
          onChange={set('company')}
          placeholder="Acme Inc."
          helper="Defaults to your company if left blank"
        />
        <Input
          label="Location"
          required
          value={values.location}
          onChange={set('location')}
          placeholder="San Francisco, CA or Remote"
          error={errors.location}
        />
        <Select
          label="Job type"
          value={values.jobType}
          onChange={set('jobType')}
          options={JOB_TYPES}
        />
        <Select
          label="Experience level"
          value={values.experienceLevel}
          onChange={set('experienceLevel')}
          options={EXPERIENCE_LEVELS}
        />
        <Select
          label="Currency"
          value={values.currency}
          onChange={set('currency')}
          options={CURRENCIES}
        />
        <Input
          label="Salary min"
          type="number"
          value={values.salaryMin}
          onChange={set('salaryMin')}
          placeholder="60000"
        />
        <Input
          label="Salary max"
          type="number"
          value={values.salaryMax}
          onChange={set('salaryMax')}
          placeholder="120000"
          error={errors.salaryMax}
        />
      </div>

      <Textarea
        label="Description"
        required
        rows={6}
        value={values.description}
        onChange={set('description')}
        placeholder="What will the person do? Who are you looking for?"
        error={errors.description}
      />

      <Textarea
        label="Responsibilities"
        rows={5}
        value={values.responsibilities}
        onChange={set('responsibilities')}
        placeholder={'One per line\nLead feature delivery\nMentor juniors'}
        helper="One responsibility per line"
      />

      <Input
        label="Skills"
        value={values.skills}
        onChange={set('skills')}
        placeholder="React, TypeScript, GraphQL"
        helper="Comma-separated list of required skills"
      />

      <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} type="button" leftIcon={<X size={14} />}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={submitting} leftIcon={<Save size={14} />}>
          Save job
        </Button>
      </div>
    </form>
  );
}
