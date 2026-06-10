type Props = {
  src?: string;
  label?: string;
  disabled?: boolean;
  onChange: (src: string) => void;
};

export function EditableImage({ src, label = "替换图片", disabled, onChange }: Props) {
  if (disabled) {
    return src ? <img className="editable-image" src={src} alt="" /> : <div className="image-placeholder">{label}</div>;
  }

  return (
    <label
      className="image-placeholder"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => onChange(String(reader.result));
        reader.readAsDataURL(file);
      }}
    >
      {src ? <img className="editable-image" src={src} alt="" /> : label}
      <input
        hidden
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => onChange(String(reader.result));
          reader.readAsDataURL(file);
        }}
      />
    </label>
  );
}
