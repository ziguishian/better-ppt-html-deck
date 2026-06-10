type Props = {
  value: string;
  className?: string;
  multiline?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export function EditableText({ value, className, multiline, disabled, onChange }: Props) {
  if (disabled) {
    const parts = multiline ? value.split("\n") : [value];
    return <span className={className}>{parts.map((part, index) => <span key={index}>{part}{index < parts.length - 1 ? <br /> : null}</span>)}</span>;
  }

  return (
    <span
      className={`${className || ""} editable-text`}
      contentEditable
      suppressContentEditableWarning
      onBlur={(event) => onChange(event.currentTarget.innerText)}
    >
      {value}
    </span>
  );
}
