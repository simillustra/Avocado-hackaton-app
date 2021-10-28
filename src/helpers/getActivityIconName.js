/**
 * This function returns an icon name based on the an action taken
 */
export default function getActivityIconName(action) {
  switch (action) {
    case 'airtime':
      return 'phone-portrait-outline';
    case 'transfer':
      return 'swap-horizontal-outline';
    case 'deposit':
      return 'card-outline';
    case 'bills':
      return 'logo-buffer';
    case 'utility':
      return 'bulb-outline';
    default:
      // throw 'action does not exist';
      break;
  }
}
