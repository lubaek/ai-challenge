interface AvatarProps {
  name: string;
  size?: number;
  backgroundImage?: string;
  backgroundColor?: string;
  border?: string;
  textColor?: string;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Avatar({
  name,
  size = 40,
  backgroundImage,
  backgroundColor,
  border,
  textColor,
}: AvatarProps) {
  const hasAvatarImage = Boolean(backgroundImage && backgroundImage.trim().length > 0);

  const style: React.CSSProperties = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
    boxSizing: 'content-box',
    backgroundImage: hasAvatarImage ? `url(${backgroundImage})` : undefined,
    backgroundPosition: '50%',
    backgroundSize: 'cover',
    backgroundColor,
    border,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    color: textColor ?? '#fff',
  };

  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold select-none"
      style={style}
    >
      {!hasAvatarImage ? <span style={{ fontSize: size * 0.35 }}>{getInitials(name)}</span> : null}
    </div>
  );
}
