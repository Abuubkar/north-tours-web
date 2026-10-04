import type { ReactNode } from 'react';

/** What the control (or, in a group, the controls) inside a field needs to be named and described. */
export type FieldControl = {
  /** The control's id (a field) or the group's (a group); ids inside a group can build on it. */
  id: string;
  /** The hint and the error, for the control's `aria-describedby`. */
  describedBy: string | undefined;
  /** The hint's id, so a group's controls can point to it. */
  hintId: string | undefined;
  /** The error message's id, while there is one: a group's controls point to it. */
  errorId: string | undefined;
  invalid: boolean;
};

export type FormFieldProps = {
  id: string;
  /** The field's name: a <label> for one control, the <legend> of a group. */
  label: string;
  /** Under or beside the label, e.g. "Required" or "Optional". */
  hint?: string;
  /** The message shown after Next while the field is wrong. */
  error?: string;
  /** field: one control named by a <label>. group: several controls in a <fieldset> named by its <legend>. */
  kind?: 'field' | 'group';
  /** Where the message sits: after the control (the default), or above a tall group, so it's seen with the label. */
  errorAt?: 'end' | 'start';
  className?: string;
  /** The control(s), given their ids and description. */
  children: (control: FieldControl) => ReactNode;
};
