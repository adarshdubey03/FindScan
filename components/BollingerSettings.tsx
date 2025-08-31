'use client';

import React, { useState, useEffect } from 'react';
import {
  BollingerSettings as BollingerSettingsType,
  BollingerBandsOptions,
  BollingerStyleSettings
} from '../lib/types';

interface BollingerSettingsProps {
  settings: BollingerSettingsType;
  onSettingsChange: (settings: BollingerSettingsType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const BollingerSettings: React.FC<BollingerSettingsProps> = ({
  settings,
  onSettingsChange,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'inputs' | 'style'>('inputs');
  const [localSettings, setLocalSettings] = useState<BollingerSettingsType>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // --- Helpers ---
  const handleInputChange = (key: keyof BollingerBandsOptions, value: any) => {
    setLocalSettings((prev) => ({
      ...prev,
      inputs: { ...prev.inputs, [key]: value }
    }));
  };

  const handleStyleChange = (section: keyof BollingerStyleSettings, key: string, value: any) => {
    setLocalSettings((prev) => ({
      ...prev,
      style: {
        ...prev.style,
        [section]: { ...prev.style[section], [key]: value }
      }
    }));
  };

  const handleApply = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="p-6 border-b border-gray-700 bg-gray-800 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Bollinger Bands Settings</h2>
              <p className="text-gray-400 text-sm">Configure indicator parameters and styling</p>
            </div>
            <button
              aria-label="Close settings"
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-bold transition-colors duration-200 w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
          <div className="flex space-x-1 bg-gray-700 p-1 rounded-md">
            {['inputs', 'style'].map(tab => (
              <button
                key={tab}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
                onClick={() => setActiveTab(tab as 'inputs' | 'style')}
              >
                {tab === 'inputs' ? 'Parameters' : 'Appearance'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-900">
          {activeTab === 'inputs' ? (
            // --- Inputs ---
            <div className="space-y-4">
              {/* Length */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Period Length</label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={localSettings.inputs.length}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    handleInputChange('length', Number.isNaN(val) ? localSettings.inputs.length : val);
                  }}
                  className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Number of periods for SMA calculation</p>
              </div>

              {/* StdDev Multiplier */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Standard Deviation Multiplier</label>
                <input
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={localSettings.inputs.stdDevMultiplier}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    handleInputChange('stdDevMultiplier', Number.isNaN(val) ? localSettings.inputs.stdDevMultiplier : val);
                  }}
                  className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Multiplier for standard deviation bands</p>
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price Source</label>
                <select
                  value={localSettings.inputs.source}
                  onChange={(e) => handleInputChange('source', e.target.value as any)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="close">Close Price</option>
                  <option value="open">Open Price</option>
                  <option value="high">High Price</option>
                  <option value="low">Low Price</option>
                </select>
              </div>

              {/* Offset */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Offset</label>
                <input
                  type="number"
                  min="-50"
                  max="50"
                  value={localSettings.inputs.offset}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    handleInputChange('offset', Number.isNaN(val) ? localSettings.inputs.offset : val);
                  }}
                  className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Bars to shift indicator (positive = forward)</p>
              </div>
            </div>
          ) : (
            // --- Style ---
            <div className="space-y-6">
              {/* Middle Line */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  Middle Line (SMA)
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={localSettings.style.middle.visible}
                      onChange={(e) => handleStyleChange('middle', 'visible', e.target.checked)}
                      className="h-4 w-4 text-green-500 rounded border-gray-600 bg-gray-800 focus:ring-green-500"
                    />
                    <span className="text-gray-300">Visible</span>
                  </label>
                  <div className="flex items-center space-x-3">
                    <label className="text-sm font-medium text-gray-300">Color</label>
                    <input
                      type="color"
                      value={localSettings.style.middle.color}
                      onChange={(e) => handleStyleChange('middle', 'color', e.target.value)}
                      className="w-8 h-8 rounded-md border border-gray-600 cursor-pointer transition-all duration-200 hover:border-green-500"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Width</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={localSettings.style.middle.lineWidth}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          handleStyleChange('middle', 'lineWidth', Number.isNaN(val) ? 1 : val);
                        }}
                        className="w-20 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300">Style</label>
                      <select
                        value={localSettings.style.middle.lineStyle}
                        onChange={(e) => handleStyleChange('middle', 'lineStyle', e.target.value)}
                        className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upper Band */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Upper Band
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={localSettings.style.upper.visible}
                      onChange={(e) => handleStyleChange('upper', 'visible', e.target.checked)}
                      className="h-4 w-4 text-green-500 rounded border-gray-600 bg-gray-800 focus:ring-green-500"
                    />
                    <span className="text-gray-300">Visible</span>
                  </label>
                  <div className="flex items-center space-x-3">
                    <label className="text-sm font-medium text-gray-300">Color</label>
                    <input
                      type="color"
                      value={localSettings.style.upper.color}
                      onChange={(e) => handleStyleChange('upper', 'color', e.target.value)}
                      className="w-8 h-8 rounded-md border border-gray-600 cursor-pointer transition-all duration-200 hover:border-green-500"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Width</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={localSettings.style.upper.lineWidth}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          handleStyleChange('upper', 'lineWidth', Number.isNaN(val) ? 1 : val);
                        }}
                        className="w-20 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300">Style</label>
                      <select
                        value={localSettings.style.upper.lineStyle}
                        onChange={(e) => handleStyleChange('upper', 'lineStyle', e.target.value)}
                        className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lower Band */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  Lower Band
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={localSettings.style.lower.visible}
                      onChange={(e) => handleStyleChange('lower', 'visible', e.target.checked)}
                      className="h-4 w-4 text-green-500 rounded border-gray-600 bg-gray-800 focus:ring-green-500"
                    />
                    <span className="text-gray-300">Visible</span>
                  </label>
                  <div className="flex items-center space-x-3">
                    <label className="text-sm font-medium text-gray-300">Color</label>
                    <input
                      type="color"
                      value={localSettings.style.lower.color}
                      onChange={(e) => handleStyleChange('lower', 'color', e.target.value)}
                      className="w-8 h-8 rounded-md border border-gray-600 cursor-pointer transition-all duration-200 hover:border-green-500"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Width</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={localSettings.style.lower.lineWidth}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          handleStyleChange('lower', 'lineWidth', Number.isNaN(val) ? 1 : val);
                        }}
                        className="w-20 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300">Style</label>
                      <select
                        value={localSettings.style.lower.lineStyle}
                        onChange={(e) => handleStyleChange('lower', 'lineStyle', e.target.value)}
                        className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <span className="w-4 h-4 bg-gray-600 rounded mr-2"></span>
                  Background Fill
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={localSettings.style.background.visible}
                      onChange={(e) => handleStyleChange('background', 'visible', e.target.checked)}
                      className="h-4 w-4 text-green-500 rounded border-gray-600 bg-gray-800 focus:ring-green-500"
                    />
                    <span className="text-gray-300">Visible</span>
                  </label>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Opacity</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={localSettings.style.background.opacity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        handleStyleChange('background', 'opacity', Number.isNaN(val) ? 10 : val);
                      }}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {localSettings.style.background.opacity}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-700 bg-gray-800 rounded-b-lg flex justify-end space-x-3">
          <button
            aria-label="Cancel changes"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-700 text-gray-300 font-medium rounded-md hover:bg-gray-600 hover:text-white transition-all duration-200"
          >
            Cancel
          </button>
          <button
            aria-label="Apply changes"
            onClick={handleApply}
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-all duration-200"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default BollingerSettings;
