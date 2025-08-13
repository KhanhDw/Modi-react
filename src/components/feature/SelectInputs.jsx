import React, { useState } from "react";
import Select from "react-select";

const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
];

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        borderRadius: '0.5rem',
        borderColor: state.isFocused ? '#60A5FA' : '#D1D5DB',
        boxShadow: state.isFocused ? '0 0 0 2px rgba(96, 165, 250, 0.5)' : 'none',
        padding: '2px 8px',
        minHeight: '44px',
        cursor: 'pointer',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#9CA3AF',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#111827',
    }),
    menu: (provided) => ({
        ...provided,
        borderRadius: '0.5rem',
        marginTop: '0.25rem',
        borderColor: '#E5E7EB',
        boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
        zIndex: 9999,
    }),
    option: (provided, state) => ({
        ...provided,
        cursor: 'pointer',
        padding: '0.5rem 1rem',
        color: state.isSelected ? '#1E40AF' : '#111827',
        backgroundColor: state.isSelected
            ? '#BFDBFE'
            : state.isFocused
                ? '#DBEAFE'
                : 'white',
        fontWeight: state.isSelected ? '600' : 'normal',
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#DBEAFE',
        borderRadius: '9999px',
        padding: '0 8px',
        marginRight: '0.25rem',
        marginBottom: '0.25rem',
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#1D4ED8',
        fontSize: '0.875rem',
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: '#1D4ED8',
        cursor: 'pointer',
        ':hover': {
            color: '#1E40AF',
        },
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

export default function SelectInputs() {
    const [singleValue, setSingleValue] = useState(null);
    const [multiValue, setMultiValue] = useState([options[0], options[2]]);

    return (
        <div className="max-w-md m-4 mx-auto bg-white rounded-lg shadow p-6 space-y-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Select Inputs</h2>

            <div>
                <label className="block mb-1 font-medium text-gray-700">Select Input</label>
                <Select
                    options={options}
                    value={singleValue}
                    onChange={setSingleValue}
                    placeholder="Select Option"
                    isClearable
                    styles={customStyles}
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                />
            </div>

            <div>
                <label className="block mb-1 font-medium text-gray-700">Multiple Select Options</label>
                <Select
                    options={options}
                    value={multiValue}
                    onChange={setMultiValue}
                    placeholder="Select Options"
                    isMulti
                    styles={customStyles}
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                />
            </div>
        </div>
    );
}
