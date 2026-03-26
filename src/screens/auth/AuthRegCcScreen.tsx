import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DynamicScreenZone from '../../components/core/DynamicScreenZone';
import { AuthJourneyParamList } from '../../navigation/ETBOnboardCCRegisterJourney';

const SCREEN_ID = 'PLAT_AUTH_REG_CC_DETAILS';
type Props = NativeStackScreenProps<AuthJourneyParamList, typeof SCREEN_ID>;

export default function AuthSecurityImageScreen({ ...navigationProps }: Props) {
  return <DynamicScreenZone screenId={SCREEN_ID} {...navigationProps} />;
}
