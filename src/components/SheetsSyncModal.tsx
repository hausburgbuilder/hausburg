import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  X,
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Info,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  initAuth,
  googleSignIn,
  googleSignOut,
  getAccessToken,
} from '../services/googleAuth';
import {
  fetchHousesFromSheet,
  createCatalogSheet,
  extractSpreadsheetId,
  SHEET_COLUMNS,
} from '../services/sheetsService';
import { House, HOUSES } from '../data/houses';

interface SheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHousesUpdated: (houses: House[], sheetId: string) => void;
  onResetToDefault: () => void;
  currentSheetId: string;
  isCustomCatalog: boolean;
  houseCount: number;
}

export function SheetsSyncModal({
  isOpen,
  onClose,
  onHousesUpdated,
  onResetToDefault,
  currentSheetId,
  isCustomCatalog,
  houseCount,
}: SheetsSyncModalProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [sheetInput, setSheetInput] = useState(currentSheetId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [showColumnsGuide, setShowColumnsGuide] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

  useEffect(() => {
    if (currentSheetId) {
      setSheetInput(currentSheetId);
    }
  }, [currentSheetId]);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setStatusMessage(null);
    setIsLoading(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setAccessToken(res.accessToken);
        setStatusMessage({
          type: 'success',
          text: `Signed in as ${res.user.displayName || res.user.email}. Ready to sync catalog!`,
        });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to authenticate with Google. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await googleSignOut();
    setCurrentUser(null);
    setAccessToken(null);
    setStatusMessage({
      type: 'info',
      text: 'Signed out of Google.',
    });
  };

  const handleSyncSheet = async () => {
    if (!sheetInput.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter a Google Sheet URL or Spreadsheet ID.',
      });
      return;
    }

    const cleanId = extractSpreadsheetId(sheetInput);
    if (!cleanId) {
      setStatusMessage({
        type: 'error',
        text: 'Invalid Google Spreadsheet ID or URL format.',
      });
      return;
    }

    let token = accessToken;
    if (!token) {
      token = await getAccessToken();
    }

    if (!token) {
      setStatusMessage({
        type: 'error',
        text: 'Google authentication required. Please sign in with Google first to access your spreadsheets.',
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const houses = await fetchHousesFromSheet(cleanId, token);
      onHousesUpdated(houses, cleanId);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncedTime(now);
      setStatusMessage({
        type: 'success',
        text: `Successfully synced ${houses.length} houses from Google Sheets!`,
      });
    } catch (err: any) {
      console.error('Sync error:', err);
      setStatusMessage({
        type: 'error',
        text:
          err?.message ||
          'Failed to load sheet data. Ensure the spreadsheet is shared with read access or owned by your Google account.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDefaultSheet = async () => {
    let token = accessToken;
    if (!token) {
      token = await getAccessToken();
    }

    if (!token) {
      setStatusMessage({
        type: 'error',
        text: 'Please sign in with Google to create a spreadsheet in your Google Drive.',
      });
      return;
    }

    setIsCreatingSheet(true);
    setStatusMessage(null);

    try {
      const result = await createCatalogSheet(token, HOUSES);
      setSheetInput(result.spreadsheetId);
      onHousesUpdated(HOUSES, result.spreadsheetId);
      setStatusMessage({
        type: 'success',
        text: 'Created "HAUSBURG Bloxburg Catalog Database" in your Google Drive with all default houses!',
      });
      // Offer opening in new tab
      window.open(result.spreadsheetUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      console.error('Creation error:', err);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to create spreadsheet in Google Drive.',
      });
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset catalog back to the default curated HAUSBURG collection?')) {
      onResetToDefault();
      setSheetInput('');
      setStatusMessage({
        type: 'info',
        text: 'Catalog restored to default HAUSBURG collection.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#142318] border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-8 text-[#f2f6f3]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#86efac]/10 border border-[#86efac]/30 flex items-center justify-center text-[#86efac]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                Google Sheets Catalog Sync
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#86efac]/10 text-[#86efac] border border-[#86efac]/20 uppercase">
                  Live Sync
                </span>
              </h3>
              <p className="text-xs text-[#a3b899]">
                Manage Bloxburg houses, gamepasses, fees, and images directly via Google Sheets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status Message Banner */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 border ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-950/40 border-rose-500/30 text-rose-200'
                  : 'bg-white/5 border-white/10 text-white/80'
              }`}
            >
              {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />}
              {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />}
              {statusMessage.type === 'info' && <Info className="w-4 h-4 shrink-0 text-white/60 mt-0.5" />}
              <span className="leading-relaxed">{statusMessage.text}</span>
            </div>
          )}

          {/* Google Auth Status Card */}
          <div className="p-4 rounded-xl liquid-glass border border-white/10 bg-white/[0.02]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#a3b899] block mb-1">
                  1. Google Workspace Connection
                </span>
                {currentUser ? (
                  <div className="flex items-center gap-3 mt-1">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || 'Google User'}
                        className="w-8 h-8 rounded-full border border-white/20"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#86efac]/20 text-[#86efac] font-bold flex items-center justify-center text-xs">
                        {(currentUser.displayName || currentUser.email || 'G').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">
                        {currentUser.displayName || 'Google Account'}
                      </p>
                      <p className="text-xs text-[#a3b899] font-mono">{currentUser.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-white/70">
                    Sign in with your Google account to grant access to view and update your catalog spreadsheets.
                  </p>
                )}
              </div>

              <div>
                {currentUser ? (
                  <button
                    onClick={handleSignOut}
                    className="liquid-glass-btn px-3 py-1.5 text-xs text-white/80 hover:text-white rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSignIn}
                    disabled={isLoading}
                    className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-white text-gray-900 hover:bg-gray-100 flex items-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    {/* Official Google 'G' icon */}
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>{isLoading ? 'Connecting...' : 'Sign in with Google'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sync / Create Section */}
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#a3b899] block">
              2. Catalog Google Sheet
            </span>

            <div>
              <label className="block text-xs font-medium text-white/80 mb-1.5">
                Google Sheet URL or Spreadsheet ID
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={sheetInput}
                  onChange={(e) => setSheetInput(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/... or ID"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-white/30 text-xs font-mono focus:outline-none focus:border-[#86efac]/70"
                />
                <button
                  onClick={handleSyncSheet}
                  disabled={isLoading || !sheetInput.trim()}
                  className="liquid-glass-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>{isLoading ? 'Syncing...' : 'Sync Catalog'}</span>
                </button>
              </div>
            </div>

            {/* Quick Actions & Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-[#a3b899]">
                <ShieldCheck className="w-4 h-4 text-[#86efac]" />
                <span>
                  Current Catalog:{' '}
                  <strong className="text-white">
                    {houseCount} {houseCount === 1 ? 'house' : 'houses'}
                  </strong>{' '}
                  {isCustomCatalog ? '(Synced from Google Sheets)' : '(Curated Default)'}
                </span>
                {lastSyncedTime && (
                  <span className="text-white/40">· Synced at {lastSyncedTime}</span>
                )}
              </div>

              {sheetInput.trim() && (
                <a
                  href={`https://docs.google.com/spreadsheets/d/${extractSpreadsheetId(sheetInput)}/edit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#86efac] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Open in Google Sheets</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Create One-Click Spreadsheet in Drive */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
              <div>
                <p className="text-xs font-semibold text-white">Don't have a spreadsheet yet?</p>
                <p className="text-xs text-[#a3b899] mt-0.5">
                  Generate a pre-formatted Bloxburg catalog spreadsheet with columns, categories, and sample houses directly in your Google Drive.
                </p>
              </div>
              <button
                onClick={handleCreateDefaultSheet}
                disabled={isCreatingSheet}
                className="liquid-glass-btn px-4 py-2 text-xs font-semibold text-[#86efac] hover:text-white rounded-lg flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
              >
                <PlusCircle className={`w-3.5 h-3.5 ${isCreatingSheet ? 'animate-spin' : ''}`} />
                <span>{isCreatingSheet ? 'Creating...' : 'Create Sheet in Drive'}</span>
              </button>
            </div>
          </div>

          {/* Column Guide Accordion */}
          <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20">
            <button
              onClick={() => setShowColumnsGuide(!showColumnsGuide)}
              className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-medium text-white/80 hover:bg-white/5 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-[#86efac]" />
                Supported Google Sheet Columns & Schema
              </span>
              {showColumnsGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showColumnsGuide && (
              <div className="p-4 border-t border-white/10 text-xs space-y-3 bg-black/30">
                <p className="text-[#a3b899]">
                  Make sure your sheet contains row 1 headers matching these names (case-insensitive):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                  {SHEET_COLUMNS.map((col) => (
                    <div key={col} className="p-1.5 rounded bg-white/5 border border-white/5 text-[#86efac]">
                      {col}
                    </div>
                  ))}
                </div>
                <div className="text-[11px] text-white/60 space-y-1 pt-2">
                  <p>• <strong>requiredGamepasses</strong>: comma-separated (e.g. <em>Advanced Placing, Multiple Floors</em>)</p>
                  <p>• <strong>featured</strong>: <em>TRUE</em> or <em>FALSE</em></p>
                  <p>• <strong>galleryImages</strong>: semicolon-separated image URLs</p>
                  <p>• <strong>plotSize</strong>: <em>Regular Plot</em> or <em>Large Plot</em></p>
                </div>
              </div>
            )}
          </div>

          {/* Reset Action */}
          {isCustomCatalog && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleReset}
                className="text-xs text-rose-300 hover:text-rose-200 hover:underline cursor-pointer"
              >
                Reset catalog to default HAUSBURG collection
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex justify-end">
          <button
            onClick={onClose}
            className="liquid-glass-btn px-5 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
