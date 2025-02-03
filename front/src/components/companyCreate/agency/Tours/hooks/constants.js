export const INITIAL_TOUR_STATE = {
  tourName: '',
  operator: '',
  adultPrice: '',
  childPrice: '',
  selectedDays: [],
  pickupTimes: [{
    hour: '',
    minute: '',
    region: '',
    area: '',
    periodActive: false,
    period: ''
  }],
  options: [],
  isActive: true
};

export const DAYS = [
  { id: 1, name: 'Pazartesi' },
  { id: 2, name: 'Salı' },
  { id: 3, name: 'Çarşamba' },
  { id: 4, name: 'Perşembe' },
  { id: 5, name: 'Cuma' },
  { id: 6, name: 'Cumartesi' },
  { id: 7, name: 'Pazar' }
]; 