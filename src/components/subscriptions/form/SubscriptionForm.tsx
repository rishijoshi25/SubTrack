import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from "react-hook-form";
import type { SubscriptionFormData, BillingCycle, Category, SubscriptionStatus } from '../../../types/subscription';
import './SubscriptionForm.css';

interface SubscriptionFormProps {
    initialData?: SubscriptionFormData;
    onSubmit: SubmitHandler<SubscriptionFormData>;
    onCancel: () => void;
    submitLabel?: string;
}

export default function SubscriptionForm( {initialData, onSubmit, onCancel, submitLabel}: SubscriptionFormProps ) {
    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting }} = useForm<SubscriptionFormData>({
        defaultValues: initialData || {
            name: '',
            price: '',
            billing_cycle: 'monthly',
            category: 'Entertainment',
            next_billing_date: '',
            status: 'active',
            trial_end_date: '',
            description: ''
        }
    });

    const billing_cycle = watch('billing_cycle');

    useEffect(() => {
        const now = new Date();
        const nextDate = new Date(now);
        
        if (billing_cycle === 'monthly') {
            nextDate.setMonth(nextDate.getMonth() + 1);
        } else if (billing_cycle === 'yearly') {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
        }

        const formattedDate = nextDate.toISOString().split('T')[0];
        setValue('next_billing_date', formattedDate);
    }, [billing_cycle, setValue]);

    
    const statusValue = watch('status');

    const handleIncomingFormData = async (data: SubscriptionFormData) => {
        const incomingFormData: SubscriptionFormData = {
            ...data,
            price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
            trial_end_date: data.status === 'trial' ? data.trial_end_date : undefined,
        };

        await onSubmit(incomingFormData);
    };

    return (
        <form className="subscription-form" onSubmit={handleSubmit(handleIncomingFormData)}>
            <div className="form-group">
                <label htmlFor='name'>Service name <span className="required">*</span></label>
                <input
                    type="text"
                    id="name"
                    {
                        ...register('name', {
                            required: 'Service name is required',
                            validate: (value) => value.trim() !== '' || 'Service name cannot be empty' 
                        })
                    }
                    className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name.message}</span>}
            </div>
            
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor='price'>Price <span className="required">*</span></label>
                    <input
                    type="text"
                    id="price"
                    {
                        ...register('price', {
                            required: 'Price is required',
                            validate: (value) => {
                                const num = typeof value === 'string' ? parseFloat(value) : value;

                                if (isNaN(num)) return 'Price must be a valid number';
                                if (num <= 0) return 'Price must be greater than 0';

                                return true;
                            }
                        })
                    }
                    className={errors.price ? 'error' : ''}
                />
                {errors.price && <span className='error-message'>{errors.price.message}</span>}
                </div>

                <div className="formGroup">
                    <label htmlFor='billing_cycle'>Billing cycle <span className="required">*</span></label>
                    <select
                        id="billing_cycle"
                        {
                            ...register('billing_cycle', {
                                required: 'Billing cycle is required'
                            })
                        }
                    >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                    {errors.billing_cycle && <span className="error-message">{errors.billing_cycle.message}</span>}
                </div>
            </div>

            
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor='category'>Category <span className="required">*</span></label>
                    <select
                        id="category"
                        {...register('category', { required: 'Category is required' })}
                    >
                        <option value="Entertainment">Entertainment</option>
                        <option value="Business">Business</option>
                        <option value="Food">Food</option>
                        <option value="Housing">Housing</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Fitness">Fitness</option>
                        <option value="ECommerce">ECommerce</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.category && <span className="error-message">{errors.category.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor='status'>Status <span className="required">*</span></label>
                    <select
                        id="status"
                        {...register('status', { required: 'Status is required' })}
                    >
                        <option value="active">Active</option>
                        <option value="trial">Trial</option>
                        <option value="paused">Paused</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    {errors.status && <span className="error-message">{errors.status.message}</span>}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="next_billing_date">Next Billing Date <span className="required">*</span></label>
                <input
                    type="date"
                    id="next_billing_date"
                    {
                        ...register('next_billing_date', {
                            required: 'Next billing date is required',
                            validate: (value) => {
                                if (!value) return 'Next billing date is required';
                                
                                const billingDate = new Date(value);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                    
                                if (billingDate < today) {
                                    return 'Next billing date must be today or in the future';
                                }
                                return true;
                            }
                        })
                    }
                    className={errors.next_billing_date ? 'error' : ''}
                />
                {errors.next_billing_date && <span className="error-message">{errors.next_billing_date.message}</span>}
                <span className="field-hint">Auto-populated based on billing cycle. You can change it if needed.</span>
            </div>
            
            {
                statusValue === 'trial' && (
                    <div className="form-group">
                        <label htmlFor="trial_end_date">Trial End Date <span className="required">*</span></label>
                        <input
                            type="date"
                            id="trial_end_date"
                            {
                                ...register('trial_end_date', {
                                    required: statusValue === 'trial' ? 'Trial end date is required when status is Trial' : false,
                                    
                                    validate: (value) => {
                                        if (statusValue !== 'trial') return true;
                                        if (!value) return 'Trial end date is required when status is Trial';
                                        
                                        const trialEndDate = new Date(value);
                                        const nextBillingDate = watch('next_billing_date');
                                        
                                        if (nextBillingDate) {
                                            const billingDate = new Date(nextBillingDate);
                                            if (trialEndDate > billingDate) {
                                                return 'Trial end date should be before or on the next billing date';
                                            }
                                        }
                                        return true;
                                    }
                                })
                            }
                            className={errors.trial_end_date ? 'error' : ''}
                        />
                            {errors.trial_end_date && <span className="error-message">{errors.trial_end_date.message}</span>}
                    </div>
                )
            }
            <div className="form-group">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                    id="description"
                    {
                        ...register('description')
                    }
                    placeholder="Add any notes about this subscription..."
                    rows={3}
                />
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    className="btn-cancel"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn-submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : submitLabel}
                </button>
            </div>
        </form>
    )
}