import { CharacterId, KidsSong } from '../types/app';

interface SongPlaybackOptions {
  repeat: boolean;
  musicEnabled: boolean;
  startAtSec?: number;
  onProgress: (elapsedSec: number) => void;
  onEnded: () => void;
}

class KidsAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlayingSong = false;
  private songTimerIds: number[] = [];
  private activeSong: KidsSong | null = null;
  private currentOptions: SongPlaybackOptions | null = null;
  private pausedAtSec = 0;
  private songStartTimestampMs = 0;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudioEl: HTMLAudioElement | null = null;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public playTone(
    freq: number,
    duration = 0.25,
    type: OscillatorType = 'triangle',
    volume = 0.14
  ) {
    const ctx = this.ensureContext();
    if (!ctx || freq <= 0) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + Math.max(0.06, duration));

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.03);
  }

  private playArrangementNote(freq: number, harmonyFreq: number | undefined, durSec: number, withBeat: boolean) {
    const ctx = this.ensureContext();
    if (!ctx || freq <= 0) return;

    // Warm marimba-like lead (fundamental + gentle 2nd harmonic)
    this.playTone(freq, durSec * 0.94, 'triangle', 0.14);
    this.playTone(freq * 2, durSec * 0.35, 'sine', 0.035);

    // Bass & chord accompaniment
    if (harmonyFreq && harmonyFreq > 0) {
      this.playTone(harmonyFreq, durSec * 0.96, 'sine', 0.08);
      this.playTone(harmonyFreq * 1.5, durSec * 0.7, 'sine', 0.045);
    }

    // Soft rhythmic pulse on main beats
    if (withBeat) {
      const kick = ctx.createOscillator();
      const kGain = ctx.createGain();
      kick.type = 'sine';
      kick.frequency.setValueAtTime(140, ctx.currentTime);
      kick.frequency.exponentialRampToValueAtTime(52, ctx.currentTime + 0.09);
      kGain.gain.setValueAtTime(0.09, ctx.currentTime);
      kGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.11);
      kick.connect(kGain);
      kGain.connect(ctx.destination);
      kick.start(ctx.currentTime);
      kick.stop(ctx.currentTime + 0.12);
    }
  }

  public playSuccess(enabled = true) {
    if (!enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, idx) => {
      window.setTimeout(() => this.playTone(f, 0.24, 'sine', 0.12), idx * 90);
    });
  }

  public playChime(enabled = true) {
    if (!enabled) return;
    this.playTone(659.25, 0.18, 'triangle', 0.1);
    window.setTimeout(() => this.playTone(880, 0.24, 'sine', 0.09), 75);
  }

  public playGentleError(enabled = true) {
    if (!enabled) return;
    this.playTone(329.63, 0.18, 'sine', 0.08);
    window.setTimeout(() => this.playTone(293.66, 0.25, 'sine', 0.08), 120);
  }

  public playCharacterSound(character: CharacterId, enabled = true) {
    if (!enabled) return;
    const map: Record<CharacterId, number[]> = {
      lucas: [440, 554.37, 659.25],
      luna: [523.25, 659.25, 783.99],
      leon: [293.66, 369.99, 440],
      cordero: [587.33, 698.46, 880],
      estrellita: [783.99, 987.77, 1174.66],
    };
    map[character].forEach((freq, i) => {
      window.setTimeout(() => this.playTone(freq, 0.2, 'triangle', 0.1), i * 80);
    });
  }

  public playSong(song: KidsSong, options: SongPlaybackOptions) {
    this.clearSongTimers();
    this.activeSong = song;
    this.currentOptions = options;
    this.pausedAtSec = options.startAtSec ?? 0;

    if (!options.musicEnabled) {
      this.isPlayingSong = false;
      return;
    }

    this.ensureContext();
    this.isPlayingSong = true;
    this.scheduleFromPosition(song, this.pausedAtSec, options);
  }

  public pauseSong(): number {
    if (!this.isPlayingSong || !this.activeSong) return this.pausedAtSec;
    const elapsed = (Date.now() - this.songStartTimestampMs) / 1000;
    this.pausedAtSec = Math.min(this.activeSong.durationSec, Math.max(0, elapsed));
    this.isPlayingSong = false;
    this.clearSongTimers();
    return this.pausedAtSec;
  }

  public resumeSong(): boolean {
    if (!this.activeSong || !this.currentOptions || !this.currentOptions.musicEnabled) {
      return false;
    }
    this.isPlayingSong = true;
    const startSec = this.pausedAtSec >= this.activeSong.durationSec ? 0 : this.pausedAtSec;
    this.scheduleFromPosition(this.activeSong, startSec, this.currentOptions);
    return true;
  }

  private scheduleFromPosition(song: KidsSong, startSec: number, options: SongPlaybackOptions) {
    this.clearSongTimers();
    const beatSec = 60 / song.bpm;
    const timeline: { offsetSec: number; durSec: number; freq: number; harmonyFreq?: number; beat: boolean }[] = [];

    let cursorSec = 0;
    let noteCounter = 0;
    while (cursorSec < song.durationSec) {
      for (const ev of song.melody) {
        if (cursorSec >= song.durationSec) break;
        const durSec = ev.duration * beatSec;
        timeline.push({
          offsetSec: cursorSec,
          durSec,
          freq: ev.freq,
          harmonyFreq: ev.harmonyFreq,
          beat: noteCounter % 2 === 0,
        });
        cursorSec += durSec;
        noteCounter++;
      }
    }

    timeline.forEach((ev) => {
      if (ev.offsetSec + 0.05 < startSec) return;
      const delayMs = Math.max(0, (ev.offsetSec - startSec) * 1000);
      const tid = window.setTimeout(() => {
        if (!this.isPlayingSong || this.activeSong?.id !== song.id) return;
        this.playArrangementNote(ev.freq, ev.harmonyFreq, ev.durSec, ev.beat);
      }, delayMs);
      this.songTimerIds.push(tid);
    });

    this.songStartTimestampMs = Date.now() - startSec * 1000;
    const progressTimer = window.setInterval(() => {
      if (!this.isPlayingSong || this.activeSong?.id !== song.id) {
        window.clearInterval(progressTimer);
        return;
      }
      const elapsed = (Date.now() - this.songStartTimestampMs) / 1000;
      this.pausedAtSec = elapsed;
      if (elapsed >= song.durationSec) {
        window.clearInterval(progressTimer);
        if (options.repeat && this.isPlayingSong) {
          this.pausedAtSec = 0;
          options.onProgress(0);
          this.scheduleFromPosition(song, 0, options);
        } else {
          this.stopSong();
          options.onEnded();
        }
      } else {
        options.onProgress(elapsed);
      }
    }, 150);
    this.songTimerIds.push(progressTimer);
  }

  private clearSongTimers() {
    this.songTimerIds.forEach((id) => {
      window.clearTimeout(id);
      window.clearInterval(id);
    });
    this.songTimerIds = [];
  }

  public stopSong() {
    this.isPlayingSong = false;
    this.pausedAtSec = 0;
    this.clearSongTimers();
  }

  public speakKidsVoice(text: string, character: CharacterId, enabled = true, onEnd?: () => void) {
    this.stopNarration();
    if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const esVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith('es-mx')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('es-419')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('es'));

    if (esVoice) utterance.voice = esVoice;
    utterance.lang = 'es-MX';

    const pitchMap: Record<CharacterId, number> = {
      lucas: 1.15,
      luna: 1.28,
      leon: 0.95,
      cordero: 1.32,
      estrellita: 1.4,
    };
    utterance.pitch = pitchMap[character];
    utterance.rate = 0.95;
    utterance.onend = () => {
      this.currentUtterance = null;
      onEnd?.();
    };
    utterance.onerror = () => {
      this.currentUtterance = null;
      onEnd?.();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public async playAuthorizedPastorAudio(
    audioPath: string,
    onEnded?: () => void
  ): Promise<{ available: boolean }> {
    this.stopNarration();
    try {
      const response = await fetch(audioPath, { method: 'HEAD' });
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !contentType.startsWith('audio/')) {
        return { available: false };
      }
      const audio = new Audio(audioPath);
      this.currentAudioEl = audio;
      audio.onended = () => {
        this.currentAudioEl = null;
        onEnded?.();
      };
      await audio.play();
      return { available: true };
    } catch {
      return { available: false };
    }
  }

  public stopNarration() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
    if (this.currentAudioEl) {
      this.currentAudioEl.pause();
      this.currentAudioEl.currentTime = 0;
      this.currentAudioEl = null;
    }
  }
}

export const audioEngine = new KidsAudioEngine();
