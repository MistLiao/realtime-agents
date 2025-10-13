import { NextRequest, NextResponse } from 'next/server';
import os from 'os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export async function POST(req: NextRequest) {
  try {
    if (process.env.ENABLE_VOLUME_CONTROL !== 'true') {
      return NextResponse.json({ error: 'disabled' }, { status: 403 });
    }

    if (os.platform() !== 'darwin') {
      return NextResponse.json({ error: 'unsupported_os' }, { status: 400 });
    }

    const { volume } = await req.json();
    const vol = Math.max(0, Math.min(100, Number(volume)));
    if (Number.isNaN(vol)) {
      return NextResponse.json({ error: 'invalid_volume' }, { status: 400 });
    }

    // macOS AppleScript: set output volume (0..100)
    const script = `set volume output volume ${vol}`;
    await execFileAsync('/usr/bin/osascript', ['-e', script]);

    return NextResponse.json({ volume: vol });
  } catch (err) {
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}


