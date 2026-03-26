import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DynamicScreenZone from '../../components/core/DynamicScreenZone';
import { AuthJourneyParamList } from '../../navigation/ETBOnboardCCRegisterJourney';

const SCREEN_ID = 'PLAT_AUTH_LOGIN_USERNAME';

type Props = NativeStackScreenProps<AuthJourneyParamList, typeof SCREEN_ID>;

export default function AuthLoginUsernameScreen({ ...navigationProps }: Props) {
  return <DynamicScreenZone screenId={SCREEN_ID} {...navigationProps} />;
}
