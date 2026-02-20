import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

const SectionRenderer = ({ 
  sectionKey, 
  formData, 
  handleArrayFieldChange, 
  addArrayField, 
  removeArrayField,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging
}) => {
  const renderEducation = () => (
    <>
      {formData.education.map((edu, index) => (
        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-700">Education {index + 1}</h3>
            {formData.education.length > 1 && (
              <button
                onClick={() => removeArrayField('education', index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Degree/Certification"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={edu.degree}
              onChange={(e) => handleArrayFieldChange('education', index, 'degree', e.target.value)}
            />
            <input
              type="text"
              placeholder="Institution"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={edu.institution}
              onChange={(e) => handleArrayFieldChange('education', index, 'institution', e.target.value)}
            />
            <input
              type="text"
              placeholder="Location"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={edu.location}
              onChange={(e) => handleArrayFieldChange('education', index, 'location', e.target.value)}
            />
            <input
              type="text"
              placeholder="GPA (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={edu.gpa}
              onChange={(e) => handleArrayFieldChange('education', index, 'gpa', e.target.value)}
            />
            <input
              type="text"
              placeholder="Start Date (e.g., Aug 2020)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={edu.startDate}
              onChange={(e) => handleArrayFieldChange('education', index, 'startDate', e.target.value)}
            />
            <input
              type="text"
              placeholder="End Date (e.g., May 2024)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={edu.endDate}
              onChange={(e) => handleArrayFieldChange('education', index, 'endDate', e.target.value)}
            />
          </div>
        </div>
      ))}
    </>
  );

  const renderExperience = () => (
    <>
      {formData.experience.map((exp, index) => (
        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-700">Experience {index + 1}</h3>
            {formData.experience.length > 1 && (
              <button
                onClick={() => removeArrayField('experience', index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Job Title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={exp.title}
              onChange={(e) => handleArrayFieldChange('experience', index, 'title', e.target.value)}
            />
            <input
              type="text"
              placeholder="Company"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={exp.company}
              onChange={(e) => handleArrayFieldChange('experience', index, 'company', e.target.value)}
            />
            <input
              type="text"
              placeholder="Location"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={exp.location}
              onChange={(e) => handleArrayFieldChange('experience', index, 'location', e.target.value)}
            />
            <input
              type="text"
              placeholder="Start Date (e.g., Jan 2020)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={exp.startDate}
              onChange={(e) => handleArrayFieldChange('experience', index, 'startDate', e.target.value)}
            />
            <input
              type="text"
              placeholder="End Date (e.g., Dec 2022 or Present)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={exp.endDate}
              onChange={(e) => handleArrayFieldChange('experience', index, 'endDate', e.target.value)}
            />
          </div>
          <RichTextEditor
            value={exp.description}
            onChange={(value) => handleArrayFieldChange('experience', index, 'description', value)}
            placeholder="Job responsibilities and achievements (use toolbar for formatting)"
          />
        </div>
      ))}
    </>
  );

  const renderSkills = () => (
    <>
      {formData.skills.map((skill, index) => (
        <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-700">Skill Category {index + 1}</h3>
            {formData.skills.length > 1 && (
              <button
                onClick={() => removeArrayField('skills', index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Category (e.g., Programming Languages, Tools, etc.)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={skill.category}
              onChange={(e) => handleArrayFieldChange('skills', index, 'category', e.target.value)}
            />
            <input
              type="text"
              placeholder="Skills (comma-separated)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={skill.items}
              onChange={(e) => handleArrayFieldChange('skills', index, 'items', e.target.value)}
            />
          </div>
        </div>
      ))}
    </>
  );

  const renderProjects = () => (
    <>
      {formData.projects.map((project, index) => (
        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-700">Project {index + 1}</h3>
            {formData.projects.length > 1 && (
              <button
                onClick={() => removeArrayField('projects', index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <input
              type="text"
              placeholder="Project Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={project.name}
              onChange={(e) => handleArrayFieldChange('projects', index, 'name', e.target.value)}
            />
            <input
              type="text"
              placeholder="Technologies Used (comma-separated)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={project.technologies}
              onChange={(e) => handleArrayFieldChange('projects', index, 'technologies', e.target.value)}
            />
            <input
              type="text"
              placeholder="Project Link (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={project.link}
              onChange={(e) => handleArrayFieldChange('projects', index, 'link', e.target.value)}
            />
          </div>
          <RichTextEditor
            value={project.description}
            onChange={(value) => handleArrayFieldChange('projects', index, 'description', value)}
            placeholder="Project description and key features (use toolbar for formatting)"
          />
        </div>
      ))}
    </>
  );

  const sectionConfigs = {
    education: {
      title: 'Education',
      addButtonText: 'Add Education',
      template: { degree: '', institution: '', location: '', startDate: '', endDate: '', gpa: '' },
      renderer: renderEducation
    },
    experience: {
      title: 'Work Experience',
      addButtonText: 'Add Experience',
      template: { title: '', company: '', location: '', startDate: '', endDate: '', description: '' },
      renderer: renderExperience
    },
    skills: {
      title: 'Skills',
      addButtonText: 'Add Skill Category',
      template: { category: '', items: '' },
      renderer: renderSkills
    },
    projects: {
      title: 'Projects',
      addButtonText: 'Add Project',
      template: { name: '', description: '', technologies: '', link: '' },
      renderer: renderProjects
    }
  };

  const config = sectionConfigs[sectionKey];

  return (
    <section 
      className={`mb-8 transition-all ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      draggable
      onDragStart={(e) => onDragStart(e, sectionKey)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, sectionKey)}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-center justify-between mb-4 group">
        <div className="flex items-center gap-2">
          <div className="cursor-move text-gray-400 hover:text-gray-600 transition-colors">
            <GripVertical className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-indigo-600 pb-2">
            {config.title}
          </h2>
        </div>
        <button
          onClick={() => addArrayField(sectionKey, config.template)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" />
          {config.addButtonText}
        </button>
      </div>
      {config.renderer()}
    </section>
  );
};

export default SectionRenderer;
