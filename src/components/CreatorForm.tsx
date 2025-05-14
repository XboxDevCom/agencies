import React, { useState, useEffect } from 'react';
import { Creator } from '../types/Creator.ts';

interface CreatorFormProps {
  creator?: Creator;
  onSubmit: (creator: Omit<Creator, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const CreatorForm: React.FC<CreatorFormProps> = ({ creator, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    platform: '',
    followers: 0,
    status: 'active' as const,
    avatar: '',
    description: '',
    socialLinks: {
      instagram: '',
      youtube: '',
      tiktok: '',
      twitter: '',
    },
  });

  useEffect(() => {
    if (creator) {
      setFormData({
        name: creator.name,
        email: creator.email,
        platform: creator.platform,
        followers: creator.followers,
        status: creator.status,
        avatar: creator.avatar,
        description: creator.description || '',
        socialLinks: creator.socialLinks || {
          instagram: '',
          youtube: '',
          tiktok: '',
          twitter: '',
        },
      });
    }
  }, [creator]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('socialLinks.')) {
      const platform = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [platform]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-Mail
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
            Plattform
          </label>
          <select
            name="platform"
            id="platform"
            required
            value={formData.platform}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Bitte wählen</option>
            <option value="Instagram">Instagram</option>
            <option value="YouTube">YouTube</option>
            <option value="TikTok">TikTok</option>
            <option value="Twitter">Twitter</option>
          </select>
        </div>

        <div>
          <label htmlFor="followers" className="block text-sm font-medium text-gray-700">
            Follower
          </label>
          <input
            type="number"
            name="followers"
            id="followers"
            required
            min="0"
            value={formData.followers}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            id="status"
            required
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="active">Aktiv</option>
            <option value="inactive">Inaktiv</option>
          </select>
        </div>

        <div>
          <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
            Avatar URL
          </label>
          <input
            type="url"
            name="avatar"
            id="avatar"
            required
            value={formData.avatar}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Beschreibung
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Social Media Links</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="socialLinks.instagram" className="block text-sm font-medium text-gray-700">
              Instagram
            </label>
            <input
              type="url"
              name="socialLinks.instagram"
              id="socialLinks.instagram"
              value={formData.socialLinks.instagram}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="socialLinks.youtube" className="block text-sm font-medium text-gray-700">
              YouTube
            </label>
            <input
              type="url"
              name="socialLinks.youtube"
              id="socialLinks.youtube"
              value={formData.socialLinks.youtube}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="socialLinks.tiktok" className="block text-sm font-medium text-gray-700">
              TikTok
            </label>
            <input
              type="url"
              name="socialLinks.tiktok"
              id="socialLinks.tiktok"
              value={formData.socialLinks.tiktok}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="socialLinks.twitter" className="block text-sm font-medium text-gray-700">
              Twitter
            </label>
            <input
              type="url"
              name="socialLinks.twitter"
              id="socialLinks.twitter"
              value={formData.socialLinks.twitter}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {creator ? 'Aktualisieren' : 'Erstellen'}
        </button>
      </div>
    </form>
  );
};

export default CreatorForm; 