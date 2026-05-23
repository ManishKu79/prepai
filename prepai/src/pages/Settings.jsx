import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, User, Shield, Brain } from 'lucide-react'
import useProfileStore from '../store/profileStore'
import ProfileInfo from '../components/profile/ProfileInfo'
import SkillsManager from '../components/profile/SkillsManager'
import AccountSettings from '../components/profile/AccountSettings'

const Settings = () => {
  const { profile, loading, fetchProfile, updateProfile, changePassword, addSkill, removeSkill, updatePreferences } = useProfileStore()

  useEffect(() => {
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your profile and account preferences</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-blue-500" />
              <h2 className="text-white font-semibold">Profile</h2>
            </div>
            <ProfileInfo profile={profile} onUpdate={updateProfile} />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-5 w-5 text-green-500" />
              <h2 className="text-white font-semibold">Skills</h2>
            </div>
            <SkillsManager
              skills={profile?.skills || []}
              onAdd={addSkill}
              onRemove={removeSkill}
            />
          </motion.div>
        </div>

        {/* Right Column */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-purple-500" />
            <h2 className="text-white font-semibold">Account</h2>
          </div>
          <AccountSettings
            preferences={profile?.preferences}
            onUpdatePassword={changePassword}
            onUpdatePreferences={updatePreferences}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default Settings