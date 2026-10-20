import React from 'react';
import { X, Check, Crown, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaywallModalProps {
  onClose: () => void;
  onUpgradeSuccess: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ onClose, onUpgradeSuccess }) => {
  const [selectedPlan, setSelectedPlan] = React.useState<'monthly' | 'yearly'>('yearly');

  const handleSimulatePurchase = () => {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    onUpgradeSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#12141c] border border-purple-500/40 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh]">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-600/30 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Header */}
          <div className="text-center pt-2 pb-4">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-500 mb-3 shadow-lg shadow-purple-600/30">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">StreakClash PRO</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Cheksiz odatlar, zanjir himoyasi va VIP maqomi bilan o'z odatlaringizni yengilmas qiling.
            </p>
          </div>

          {/* Features Comparison */}
          <div className="space-y-2.5 my-4">
            {[
              { text: 'Cheksiz Odatlar (Bepulda faqat 3 ta)', pro: true },
              { text: 'Streak Freeze — zanjir uzilib ketishidan 100% himoya', pro: true },
              { text: '1v1 Cheksiz Duellar ochish huquqi', pro: true },
              { text: 'Leaderboardda Oltin VIP Toj (Crown) maqomi', pro: true },
              { text: 'Eksklyuziv Neon Mavzular & Story shablonlari', pro: true },
              { text: 'AI Habit Coach maslahatlari va tahlillari', pro: true },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Pricing Selector */}
          <div className="grid grid-cols-2 gap-3 my-5">
            {/* Yearly (Best Value) */}
            <div
              onClick={() => setSelectedPlan('yearly')}
              className={`p-3.5 rounded-xl border cursor-pointer relative transition-all ${
                selectedPlan === 'yearly'
                  ? 'border-purple-500 bg-purple-950/40 shadow-lg shadow-purple-900/30 ring-1 ring-purple-500'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow">
                ENG FOYDALI (-60%)
              </div>
              <div className="text-xs font-bold text-white mt-1">1 Yillik</div>
              <div className="text-lg font-black text-purple-400 mt-0.5">$29.99</div>
              <div className="text-[10px] text-slate-400">oyiga atigi $2.50</div>
            </div>

            {/* Monthly */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={`p-3.5 rounded-xl border cursor-pointer relative transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-purple-500 bg-purple-950/40 shadow-lg shadow-purple-900/30 ring-1 ring-purple-500'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-white mt-1">1 Oylik</div>
              <div className="text-lg font-black text-white mt-0.5">$3.99</div>
              <div className="text-[10px] text-slate-400">har oy yangilanadi</div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleSimulatePurchase}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-purple-600/40 transition active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            PRO A'zolikni Faollashtirish
          </button>

          <p className="text-[10px] text-center text-slate-500 mt-3">
            Istalgan vaqtda bekor qilish mumkin. 100% xavfsiz to'lov (App Store & Google Play).
          </p>
        </div>
      </div>
    </div>
  );
};
