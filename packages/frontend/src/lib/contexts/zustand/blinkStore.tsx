import { create } from 'zustand';

interface BlinkFormData {
  title: string;
  description: string;
  fields: string[];
  iconUrl: string;
  stylePreset: string;
  serverId: string;
  code: string;
}


interface BlinkStore {
  formData: BlinkFormData;
  setFormData: (key: keyof BlinkFormData, value: string | string[]) => void;
  addField: () => void;
}

export const useBlinkStore = create<BlinkStore>((set) => ({
  formData: {
    title: '',
    description: '',
    fields: ['Field 1'],
    iconUrl: '',
    stylePreset: 'default',
    serverId: '',
    code: '',
  },
  setFormData: (key, value) =>
    set((state) => ({
      formData: { ...state.formData, [key]: value },
    })),
  addField: () =>
    set((state) => ({
      formData: {
        ...state.formData,
        fields: [...state.formData.fields, `Field ${state.formData.fields.length + 1}`],
      },
    })),
}));