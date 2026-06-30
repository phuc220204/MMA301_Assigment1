import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';

import AppButton from '../components/AppButton';
import AppHeader from '../components/AppHeader';
import Avatar from '../components/Avatar';
import FormInput from '../components/FormInput';
import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';

const profileSchema = Yup.object({
  name: Yup.string()
    .test('name-required', 'Name is required.', (value) => Boolean(value?.trim().length))
    .test(
      'name-min-length',
      'Name must be at least 2 characters.',
      (value) => !value?.trim().length || value.trim().length >= 2
    ),
  bio: Yup.string().test(
    'bio-required',
    'Bio is required.',
    (value) => Boolean(value?.trim().length)
  ),
});

export default function EditProfileScreen({ navigation }) {
  const { profile, updateProfile } = useProfile();
  const { colors } = useTheme();

  return (
    <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Edit Profile" onBack={navigation.goBack} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardArea}
      >
        <Formik
          initialValues={{ name: profile.name, bio: profile.bio }}
          validateOnBlur
          validateOnChange={false}
          validationSchema={profileSchema}
          onSubmit={(values, { setSubmitting }) => {
            updateProfile({ name: values.name.trim(), bio: values.bio.trim() });
            setSubmitting(false);
            navigation.goBack();
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
          }) => (
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View
                style={[
                  styles.card,
                  { backgroundColor: colors.card, shadowColor: colors.shadow },
                ]}
              >
                <View style={styles.intro}>
                  <Avatar source={profile.avatar} size={74} subtle />
                  <View style={styles.introCopy}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Update your information</Text>
                    <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                      Keep your profile fresh and up to date.
                    </Text>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <FormInput
                  error={touched.name ? errors.name : undefined}
                  label="Name"
                  onBlur={handleBlur('name')}
                  onChangeText={handleChange('name')}
                  placeholder="Enter your name"
                  returnKeyType="next"
                  value={values.name}
                />
                <FormInput
                  error={touched.bio ? errors.bio : undefined}
                  label="Bio"
                  maxLength={220}
                  multiline
                  onBlur={handleBlur('bio')}
                  onChangeText={handleChange('bio')}
                  placeholder="Tell us about yourself"
                  value={values.bio}
                />
              </View>

              <View style={styles.actions}>
                <AppButton loading={isSubmitting} title="Save Changes" onPress={handleSubmit} />
                <AppButton title="Cancel" variant="secondary" onPress={navigation.goBack} style={styles.cancel} />
              </View>
            </ScrollView>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 28,
    padding: 22,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 22,
    elevation: 3,
  },
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  introCopy: {
    flex: 1,
    marginLeft: 18,
  },
  cardTitle: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  cardSubtitle: {
    marginTop: 5,
    fontSize: 15,
    lineHeight: 21,
  },
  divider: {
    height: 1,
    marginTop: 22,
    marginBottom: 24,
  },
  actions: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: 34,
  },
  cancel: {
    marginTop: 12,
  },
});
