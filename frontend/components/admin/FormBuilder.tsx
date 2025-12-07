/**
 * FormBuilder Component
 * Dynamic form builder for admin pages
 */

'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import FileUpload from './FileUpload';

export type FieldType = 'text' | 'textarea' | 'number' | 'email' | 'select' | 'multiselect' | 'file' | 'json';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  rows?: number;
  validation?: (value: any) => string | null;
  helpText?: string;
}

interface FormBuilderProps {
  fields: FormField[];
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
  errors?: Record<string, string>;
  className?: string;
}

export default function FormBuilder({
  fields,
  values,
  onChange,
  errors = {},
  className,
}: FormBuilderProps) {
  const handleChange = (name: string, value: any) => {
    onChange(name, value);
  };

  const renderField = (field: FormField) => {
    const value = values[field.name] ?? '';
    const error = errors[field.name];

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.name}
            name={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={field.rows || 4}
            className={cn(
              'w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              error && 'border-red-500'
            )}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={field.name}
            name={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, Number(e.target.value))}
            placeholder={field.placeholder}
            required={field.required}
            className={cn(
              'w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              error && 'border-red-500'
            )}
          />
        );

      case 'email':
        return (
          <input
            type="email"
            id={field.name}
            name={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={cn(
              'w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              error && 'border-red-500'
            )}
          />
        );

      case 'select':
        return (
          <select
            id={field.name}
            name={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            className={cn(
              'w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              error && 'border-red-500'
            )}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => {
              const selectedValues = Array.isArray(value) ? value : [];
              const isChecked = selectedValues.includes(option.value);
              return (
                <label key={option.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...selectedValues, option.value]
                        : selectedValues.filter((v) => v !== option.value);
                      handleChange(field.name, newValues);
                    }}
                    className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                  />
                  <span className="text-sm text-white/80">{option.label}</span>
                </label>
              );
            })}
          </div>
        );

      case 'json':
        return (
          <textarea
            id={field.name}
            name={field.name}
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleChange(field.name, parsed);
              } catch {
                handleChange(field.name, e.target.value);
              }
            }}
            placeholder={field.placeholder || 'Enter JSON'}
            required={field.required}
            rows={field.rows || 6}
            className={cn(
              'w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm',
              error && 'border-red-500'
            )}
          />
        );

      case 'file':
        return (
          <FileUpload
            label=""
            value={value}
            onChange={(url) => handleChange(field.name, url)}
            className="w-full"
            error={error}
          />
        );

      default:
        return (
          <input
            type="text"
            id={field.name}
            name={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={cn(
              'w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              error && 'border-red-500'
            )}
          />
        );
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {fields.map((field) => {
        const error = errors[field.name];
        return (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-white/80 mb-2"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
            {field.helpText && (
              <p className="mt-1 text-sm text-white/60">{field.helpText}</p>
            )}
            {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
          </div>
        );
      })}
    </div>
  );
}

