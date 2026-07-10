interface EditorialDividerProps {
  text: string;
}

export function EditorialDivider({ text }: EditorialDividerProps) {
  return (
    <div className="py-14 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="border-t border-border/50 pt-14 lg:pt-20">
          <p
            className="text-[28px] lg:text-[44px] xl:text-[52px] font-light italic text-foreground/60 leading-[1.15] max-w-3xl"
            style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
          >
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
