import styles from './GlassButton.module.css';

// Premium Apple-style button with glass treatment. Two variants:
//   - primary: light fill (the "Continue / Enter" CTA)
//   - ghost:   translucent glass with border
// `as` lets it render as a button, an anchor, or a router Link.
export default function GlassButton({
  children,
  variant = 'primary',
  size = 'md',
  as: Tag = 'button',
  className = '',
  ...rest
}) {
  return (
    <Tag
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`}
      {...rest}
    >
      <span className={styles.label}>{children}</span>
    </Tag>
  );
}
