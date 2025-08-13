import React, { useState } from "react";

function Checkbox({ checked, onChange, label, disabled }) {
    return (
        <label
            className={`inline-flex items-center cursor-pointer select-none ${disabled ? "cursor-not-allowed opacity-50" : "hover:text-indigo-600"
                }`}
        >
            <input
                type="checkbox"
                className={`appearance-none h-6 w-6 rounded-md border-2 border-gray-300
          checked:bg-indigo-600 checked:border-indigo-600
          checked:before:content-['✔'] checked:before:absolute checked:before:text-white
          checked:before:text-lg checked:before:top-1/2 checked:before:left-1/2
          checked:before:-translate-x-1/2 checked:before:-translate-y-1/2
          disabled:bg-gray-100 disabled:border-gray-200 disabled:cursor-not-allowed
          relative
          transition-colors duration-200
        `}
                checked={checked}
                disabled={disabled}
                onChange={(e) => onChange(e.target.checked)}
            />
            <span className="ml-2 font-semibold text-gray-900 select-none">{label}</span>
        </label>
    );
}

function Radio({ id, name, value, checked, onChange, label, disabled }) {
    return (
        <label
            htmlFor={id}
            className={`inline-flex items-center cursor-pointer select-none ${disabled ? "cursor-not-allowed opacity-50" : "hover:text-indigo-600"
                }`}
        >
            <input
                type="radio"
                id={id}
                name={name}
                value={value}
                checked={checked}
                disabled={disabled}
                onChange={() => onChange(value)}
                className="hidden"
            />
            {/* vòng tròn lớn */}
            <div
                className={`
          flex justify-center items-center
          h-6 w-6 rounded-full border-2 border-gray-300
          ${checked ? "border-indigo-600 bg-indigo-600" : ""}
          ${disabled ? "bg-gray-100 border-gray-200" : ""}
          transition-colors duration-200
          relative
        `}
            >
                {/* vòng tròn nhỏ trắng */}
                {checked && (
                    <div className="h-3 w-3 rounded-full bg-white" />
                )}
            </div>
            <span className="ml-2 font-semibold text-gray-900 select-none">{label}</span>
        </label>
    );
}


function Switch({ label, defaultChecked = false, onChange, disabled = false, color = "indigo" }) {
    const [checked, setChecked] = useState(defaultChecked);

    const handleToggle = () => {
        if (disabled) return;
        const newChecked = !checked;
        setChecked(newChecked);
        if (onChange) onChange(newChecked);
    };

    const colors = {
        indigo: {
            bgOn: "bg-indigo-600",
            bgOff: "bg-gray-300",
            dotOn: "translate-x-6",
            dotOff: "translate-x-1",
        },
        gray: {
            bgOn: "bg-gray-900",
            bgOff: "bg-gray-400",
            dotOn: "translate-x-6",
            dotOff: "translate-x-1",
        },
    };

    const currentColor = colors[color] || colors.indigo;

    return (
        <label
            className={`inline-flex items-center cursor-pointer select-none ${disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
        >
            <div
                onClick={handleToggle}
                className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${checked ? currentColor.bgOn : currentColor.bgOff
                    }`}
            >
                <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${checked ? currentColor.dotOn : currentColor.dotOff
                        }`}
                />
            </div>
            <span className="ml-3 text-gray-900 font-medium select-none">{label}</span>
        </label>
    );
}

export default function Demo() {
    const [isChecked, setIsChecked] = useState(false);
    const [isCheckedTwo, setIsCheckedTwo] = useState(true);
    const [isCheckedDisabled, setIsCheckedDisabled] = useState(true);

    const [selectedValue, setSelectedValue] = useState("option2");

    const handleSwitchChange = (checked) => {
        console.log("Switch is now:", checked ? "ON" : "OFF");
    };

    return (
        <div className="p-6 m-4 max-w-xl mx-auto space-y-6 bg-white rounded-lg border border-gray-200">
            {/* Checkbox Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Checkbox</h3>
                <div className="flex gap-6">
                    <Checkbox checked={isChecked} onChange={setIsChecked} label="Default" />
                    <Checkbox checked={isCheckedTwo} onChange={setIsCheckedTwo} label="Checked" />
                    <Checkbox checked={isCheckedDisabled} onChange={setIsCheckedDisabled} label="Disabled" disabled />
                </div>
            </section>

            {/* Radio Section */}
            <section className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Radio Buttons</h3>
                <div className="flex gap-6">
                    <Radio
                        id="radio1"
                        name="group1"
                        value="option1"
                        checked={selectedValue === "option1"}
                        onChange={setSelectedValue}
                        label="Default"
                    />
                    <Radio
                        id="radio2"
                        name="group1"
                        value="option2"
                        checked={selectedValue === "option2"}
                        onChange={setSelectedValue}
                        label="Selected"
                    />
                    <Radio
                        id="radio3"
                        name="group1"
                        value="option3"
                        checked={selectedValue === "option3"}
                        onChange={setSelectedValue}
                        label="Disabled"
                        disabled
                    />
                </div>
            </section>

            {/* Switch Section */}
            <section className="space-y-6 border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Toggle switch input</h3>

                <div className="flex gap-6 items-center">
                    <Switch label="Default" defaultChecked={true} onChange={handleSwitchChange} />
                    <Switch label="Checked" defaultChecked={true} onChange={handleSwitchChange} />
                    <Switch label="Disabled" disabled />
                </div>

                <div className="flex gap-6 items-center">
                    <Switch label="Default" defaultChecked={true} onChange={handleSwitchChange} color="gray" />
                    <Switch label="Checked" defaultChecked={true} onChange={handleSwitchChange} color="gray" />
                    <Switch label="Disabled" disabled color="gray" />
                </div>
            </section>
        </div>
    );
}
