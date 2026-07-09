interface EditorialDividerProps {
  text: string;
}

export function EditorialDivider({ text }: EditorialDividerProps) {
  return (
    <div className="border-t border-border py-10 lg:py-14">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <p
          className="text-base lg:text-lg font-light italic text-foreground/40"
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
