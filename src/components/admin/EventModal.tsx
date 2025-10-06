// src/components/admin/EventModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Event, CreateEventData, UpdateEventData } from '@/hooks/useEvents';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEventData | UpdateEventData) => Promise<boolean>;
  event?: Event | null;
  isLoading?: boolean;
  onFileUpload?: (file: File) => Promise<string | null>;
}

export default function EventModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  event, 
  isLoading = false,
  onFileUpload 
}: EventModalProps) {
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    slug: '',
    date: '',
    venue: '',
    description: '',
    banner_image: '',
    max_capacity: undefined,
    registration_fee: undefined,
    requires_approval: false,
    status: 'published'
  });
  
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or event changes
  useEffect(() => {
    if (isOpen) {
      if (event) {
        // Editing existing event
        setFormData({
          title: event.title || '',
          slug: event.slug || '',
          date: event.date || '',
          venue: event.venue || '',
          description: event.description || '',
          banner_image: event.banner_image || '',
          max_capacity: event.max_capacity,
          registration_fee: event.registration_fee,
          requires_approval: event.requires_approval || false,
          status: event.status || 'published'
        });
      } else {
        // Creating new event
        setFormData({
          title: '',
          slug: '',
          date: '',
          venue: '',
          description: '',
          banner_image: '',
          max_capacity: undefined,
          registration_fee: undefined,
          requires_approval: false,
          status: 'published'
        });
      }
      setBannerFile(null);
      setErrors({});
    }
  }, [isOpen, event]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !event) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, event]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required';
    
    // Validate date is not in the past
    const eventDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (eventDate < today) {
      newErrors.date = 'Event date cannot be in the past';
    }

    // Validate capacity if provided
    if (formData.max_capacity !== undefined && formData.max_capacity < 1) {
      newErrors.max_capacity = 'Capacity must be at least 1';
    }

    // Validate fee if provided
    if (formData.registration_fee !== undefined && formData.registration_fee < 0) {
      newErrors.registration_fee = 'Registration fee cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CreateEventData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, banner: 'Please select a valid image file (JPEG, PNG, or WebP)' }));
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, banner: 'Image must be smaller than 5MB' }));
        return;
      }

      setBannerFile(file);
      setErrors(prev => ({ ...prev, banner: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setUploading(true);
      
      let bannerUrl = formData.banner_image;
      
      // Upload new banner if file selected
      if (bannerFile && onFileUpload) {
        const uploadedUrl = await onFileUpload(bannerFile);
        if (!uploadedUrl) {
          setErrors(prev => ({ ...prev, banner: 'Failed to upload banner image' }));
          return;
        }
        bannerUrl = uploadedUrl;
      }

      const eventData = {
        ...formData,
        banner_image: bannerUrl,
      };

      const success = await onSubmit(
        event ? { ...eventData, id: event.id } : eventData
      );

      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error submitting event:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Edit Event' : 'Create New Event'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Title *
          </label>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter event title"
            error={errors.title}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Slug *
          </label>
          <Input
            value={formData.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="event-url-slug"
            error={errors.slug}
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be used in the event URL
          </p>
        </div>

        {/* Date and Venue */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              error={errors.date}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Venue *
            </label>
            <Input
              value={formData.venue}
              onChange={(e) => handleInputChange('venue', e.target.value)}
              placeholder="Event venue"
              error={errors.venue}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Event description..."
          />
        </div>

        {/* Capacity and Fee */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Capacity
            </label>
            <Input
              type="number"
              min="1"
              value={formData.max_capacity || ''}
              onChange={(e) => handleInputChange('max_capacity', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="No limit"
              error={errors.max_capacity}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Fee ($)
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.registration_fee || ''}
              onChange={(e) => handleInputChange('registration_fee', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="0.00"
              error={errors.registration_fee}
            />
          </div>
        </div>

        {/* Banner Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Banner
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.banner && <p className="text-sm text-red-600 mt-1">{errors.banner}</p>}
          {formData.banner_image && (
            <p className="text-xs text-gray-500 mt-1">
              Current banner: {formData.banner_image.split('/').pop()}
            </p>
          )}
        </div>

        {/* Status and Options */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value as 'draft' | 'published')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              id="requires_approval"
              type="checkbox"
              checked={formData.requires_approval || false}
              onChange={(e) => handleInputChange('requires_approval', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="requires_approval" className="ml-2 text-sm text-gray-700">
              Require admin approval for registrations
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading || uploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || uploading}
          >
            {uploading ? 'Uploading...' : isLoading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}