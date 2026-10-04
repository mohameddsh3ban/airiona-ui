# Generates the end voice-over with the local Qwen3-TTS 1.7B CustomVoice model (runs on the GPU, offline).
#   C:/Users/ASUS/ai/qwen3-tts/.venv/Scripts/python.exe tools/showcase/voiceover.py [speaker ...]
import os, sys
os.environ.setdefault("HF_HUB_OFFLINE", "1")
import torch, soundfile as sf
from qwen_tts.inference.qwen3_tts_model import Qwen3TTSModel

OUT = os.path.join(os.path.dirname(__file__), "..", "..", "showcase", "audio", "vo")
os.makedirs(OUT, exist_ok=True)
# Written for the ear: "m2a-dev" is read as "M two A dev", the domain as "dot D E".
TEXT = "Made by Mohamed Shaban, from the M two A dev team. For more like this, visit M two A dev dot D E."
INSTRUCT = "A young woman with a cute, sweet and cheerful voice, smiling as she speaks. Light, bubbly and friendly, clear English, relaxed pace, like a charming sign-off at the end of a stylish product video."

import glob
# The local snapshot path (a repo id triggers an online lookup in the processor loader).
SNAP = glob.glob(os.path.expanduser("~/.cache/huggingface/hub/models--Qwen--Qwen3-TTS-12Hz-1.7B-CustomVoice/snapshots/*"))[0]
model = Qwen3TTSModel.from_pretrained(SNAP, device_map="cuda:0", dtype=torch.bfloat16)
speakers = sorted(model.model.get_supported_speakers() or [])
print("speakers:", speakers, flush=True)
wanted = sys.argv[1:] or speakers
for spk in wanted:
    spk = spk.lower()
    if spk not in speakers:
        print("skip", spk); continue
    wavs, sr = model.generate_custom_voice(text=TEXT, speaker=spk, language="English", instruct=INSTRUCT)
    path = os.path.join(OUT, f"vo-{spk}.wav")
    sf.write(path, wavs[0], sr)
    print(f"{spk}: {len(wavs[0]) / sr:.2f}s -> {path}", flush=True)
