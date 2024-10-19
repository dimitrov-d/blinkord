// @source - https://docs.dialect.to/documentation/actions/specification/multi-actions

export interface Action {
  /** url of some descriptive image for the action */
  icon: string;
  /** title of the action */
  title: string;
  /** brief description of the action */
  description: string;
  /** text to be rendered on the action button */
  label: string;
  /** optional state for disabling the action button(s) */
  disabled?: boolean;
  /** optional list of related Actions */
  links?: {
    actions: LinkedAction[];
  };
  /** optional (non-fatal) error message */
  error?: ActionError;
  /** original URL of the action */
  href: string;
}

export interface LinkedAction {
  /** URL endpoint for an action */
  href: string;
  /** button text rendered to the user */
  label: string;
  /** Parameter to accept user input within an action */
  parameters?: [ActionParameter];
}

/** Parameter to accept user input within an action */
export interface ActionParameter {
  /** input field type */
  type?: ActionParameterType;
  /** parameter name in url */
  name: string;
  /** placeholder text for the user input field */
  label?: string;
  /** declare if this field is required (defaults to `false`) */
  required?: boolean;
  /** regular expression pattern to validate user input client side */
  pattern?: string;
  /** human-readable description of the `type` and/or `pattern`, represents a caption and error, if value doesn't match */
  patternDescription?: string;
  /** the minimum value allowed based on the `type` */
  min?: string | number;
  /** the maximum value allowed based on the `type` */
  max?: string | number;

  options: Array<{
    /** displayed UI label of this selectable option */
    label: string;
    /** value of this selectable option */
    value: string;
    /** whether or not this option should be selected by default */
    selected?: boolean;
  }>;
}

export type ActionParameterType =
  | 'text'
  | 'email'
  | 'url'
  | 'number'
  | 'date'
  | 'datetime-local'
  | 'checkbox'
  | 'radio'
  | 'textarea'
  | 'select';

export interface ActionError {
  /** non-fatal error message to be displayed to the user */
  message: string;
}
