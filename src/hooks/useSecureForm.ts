
import { useState, useCallback } from 'react';
import { useSecurity } from '@/components/SecurityProvider';

interface FormField {
  value: string;
  error: string;
  touched: boolean;
}

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export const useSecureForm = <T extends Record<string, ValidationRule>>(
  initialValues: Record<keyof T, string>,
  validationRules: T
) => {
  const { sanitizeInput, validateEmail, validateUrl } = useSecurity();
  
  const [fields, setFields] = useState<Record<keyof T, FormField>>(() => {
    const initialFields: any = {};
    Object.keys(initialValues).forEach(key => {
      initialFields[key] = {
        value: initialValues[key],
        error: '',
        touched: false
      };
    });
    return initialFields;
  });

  const validateField = useCallback((
    name: keyof T,
    value: string,
    rules: ValidationRule
  ): string => {
    const sanitizedValue = sanitizeInput(value);

    if (rules.required && !sanitizedValue.trim()) {
      return 'Este campo é obrigatório';
    }

    if (rules.minLength && sanitizedValue.length < rules.minLength) {
      return `Mínimo de ${rules.minLength} caracteres`;
    }

    if (rules.maxLength && sanitizedValue.length > rules.maxLength) {
      return `Máximo de ${rules.maxLength} caracteres`;
    }

    if (rules.pattern && !rules.pattern.test(sanitizedValue)) {
      return 'Formato inválido';
    }

    // Special validation for email fields
    if (name.toString().toLowerCase().includes('email') && sanitizedValue) {
      if (!validateEmail(sanitizedValue)) {
        return 'Email inválido';
      }
    }

    // Special validation for URL fields
    if (name.toString().toLowerCase().includes('url') && sanitizedValue) {
      if (!validateUrl(sanitizedValue)) {
        return 'URL inválida';
      }
    }

    if (rules.custom) {
      const customError = rules.custom(sanitizedValue);
      if (customError) return customError;
    }

    return '';
  }, [sanitizeInput, validateEmail, validateUrl]);

  const updateField = useCallback((name: keyof T, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    const error = validateField(name, sanitizedValue, validationRules[name]);

    setFields(prev => ({
      ...prev,
      [name]: {
        value: sanitizedValue,
        error,
        touched: true
      }
    }));
  }, [sanitizeInput, validateField, validationRules]);

  const validateAll = useCallback((): boolean => {
    let isValid = true;
    const newFields = { ...fields };

    Object.keys(validationRules).forEach(key => {
      const fieldKey = key as keyof T;
      const error = validateField(
        fieldKey,
        fields[fieldKey].value,
        validationRules[fieldKey]
      );
      
      newFields[fieldKey] = {
        ...fields[fieldKey],
        error,
        touched: true
      };

      if (error) isValid = false;
    });

    setFields(newFields);
    return isValid;
  }, [fields, validateField, validationRules]);

  const getValues = useCallback(() => {
    const values: any = {};
    Object.keys(fields).forEach(key => {
      values[key] = fields[key as keyof T].value;
    });
    return values as Record<keyof T, string>;
  }, [fields]);

  const reset = useCallback(() => {
    const resetFields: any = {};
    Object.keys(initialValues).forEach(key => {
      resetFields[key] = {
        value: initialValues[key],
        error: '',
        touched: false
      };
    });
    setFields(resetFields);
  }, [initialValues]);

  return {
    fields,
    updateField,
    validateAll,
    getValues,
    reset,
    isValid: Object.values(fields).every(field => !field.error)
  };
};
