import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, Users, Check, AlertCircle } from 'lucide-react';
interface Recipient {
  id: string;
  name: string;
  email: string;
  notified: boolean;
}
const sampleRecipients: Recipient[] = [{
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  notified: false
}, {
  id: '2',
  name: 'Michael Torres',
  email: 'michael@example.com',
  notified: false
}, {
  id: '3',
  name: 'Linda Martinez',
  email: 'linda@example.com',
  notified: true
}];
export function NotificationSystem() {
  const [recipients, setRecipients] = useState<Recipient[]>(sampleRecipients);
  const [emailSubject, setEmailSubject] = useState("Invitation to Share Memories - Rena's Celebration of Life");
  const [emailBody, setEmailBody] = useState(`Dear [Name],\n\nYou're invited to share your photos and memories for Rena Michele Voghel's Celebration of Life on February 13th, 2026.\n\nPlease visit the memorial website to upload your photos and videos:\n[MEMORIAL_LINK]\n\nAccess code: rena2025\n\nWith love and remembrance,\nThe Family`);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const handleSendInvitations = async () => {
    setSending(true);
    // Simulate sending emails
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRecipients(prev => prev.map(r => ({
      ...r,
      notified: true
    })));
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };
  const notifiedCount = recipients.filter(r => r.notified).length;
  return <div className="space-y-6">
      <div>
        <h3 className="text-2xl script-font text-[var(--sunset-orange)] mb-2">
          Email Invitations
        </h3>
        <p className="text-gray-600 font-serif text-sm">
          Invite family and friends to contribute to the memorial
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-sm font-serif">Total Recipients</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {recipients.length}
          </div>
        </div>
        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 text-green-700 mb-1">
            <Check className="w-4 h-4" />
            <span className="text-sm font-serif">Notified</span>
          </div>
          <div className="text-2xl font-bold text-green-800">
            {notifiedCount}
          </div>
        </div>
      </div>

      {/* Email Template */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
        <h4 className="font-serif text-lg text-gray-800 mb-4">
          Email Template
        </h4>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-serif text-gray-700 mb-2">
              Subject
            </label>
            <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--sunset-orange)] focus:border-transparent outline-none font-serif" />
          </div>

          <div>
            <label className="block text-sm font-serif text-gray-700 mb-2">
              Message
            </label>
            <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={8} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--sunset-orange)] focus:border-transparent outline-none font-serif resize-none" />
          </div>
        </div>
      </div>

      {/* Recipients List */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
        <h4 className="font-serif text-lg text-gray-800 mb-4">Recipients</h4>

        <div className="space-y-2">
          {recipients.map(recipient => <div key={recipient.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${recipient.notified ? 'bg-green-500' : 'bg-gray-300'}`} />
                <div>
                  <p className="font-serif text-sm text-gray-800">
                    {recipient.name}
                  </p>
                  <p className="text-xs text-gray-500">{recipient.email}</p>
                </div>
              </div>
              {recipient.notified && <span className="text-xs text-green-600 font-serif">Sent</span>}
            </div>)}
        </div>
      </div>

      {/* Send Button */}
      <button onClick={handleSendInvitations} disabled={sending || notifiedCount === recipients.length} className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[var(--sunset-orange)] to-[var(--sunset-coral)] text-white rounded-xl hover:shadow-lg transition-all font-serif disabled:opacity-50 disabled:cursor-not-allowed">
        {sending ? <>
            <Mail className="w-5 h-5 animate-pulse" />
            Sending Invitations...
          </> : sent ? <>
            <Check className="w-5 h-5" />
            Invitations Sent!
          </> : <>
            <Send className="w-5 h-5" />
            Send Invitations ({recipients.length - notifiedCount} remaining)
          </>}
      </button>

      {/* Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 font-serif">
            <p className="font-bold mb-1">Demo Mode</p>
            <p>
              In production, this would send real emails via SendGrid, AWS SES,
              or similar service. Recipients would receive a personalized
              invitation with the memorial link and access code.
            </p>
          </div>
        </div>
      </div>
    </div>;
}