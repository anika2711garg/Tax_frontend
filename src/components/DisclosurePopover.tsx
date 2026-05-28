import React, { useEffect, useId, useState } from "react";
import { ChevronDown, ChevronUp, Info, X } from "lucide-react";

type DisclosurePopoverProps = {
  variant: "link" | "banner";
  triggerAriaLabel: string;
  triggerContent: React.ReactNode;
  items: string[];
  note?: string;
  align?: "left" | "right";
};

export const DisclosurePopover: React.FC<DisclosurePopoverProps> = ({
  variant,
  triggerAriaLabel,
  triggerContent,
  items,
  note,
  align = "left"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverId = useId();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={`disclosure-popover disclosure-popover--${variant} disclosure-popover--${align}`}>
      <button
        type="button"
        className={`disclosure-trigger disclosure-trigger--${variant}`}
        aria-label={triggerAriaLabel}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={popoverId}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {variant === "link" ? (
          <span className="disclosure-link-label">{triggerContent}</span>
        ) : (
          <span className="disclosure-banner-label">
            <Info size={16} className="disclosure-banner-icon" />
            {triggerContent}
          </span>
        )}

        {variant === "banner" && (
          <span className="disclosure-trigger-chevron" aria-hidden="true">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        )}
      </button>

      {isOpen && <button type="button" className="disclosure-popover-backdrop" aria-label="Close popover" onClick={() => setIsOpen(false)} />}

      {isOpen && (
        <div id={popoverId} role="dialog" aria-label={triggerAriaLabel} className="disclosure-popover-card">
          <button type="button" className="disclosure-popover-close" aria-label="Close popover" onClick={() => setIsOpen(false)}>
            <X size={14} />
          </button>

          {variant === "banner" && <div className="disclosure-popover-heading">Important Notes And Disclaimers</div>}

          <ul className="disclosure-popover-list">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {note && <p className="disclosure-popover-note">{note}</p>}
        </div>
      )}
    </div>
  );
};