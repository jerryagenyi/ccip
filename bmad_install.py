#!/usr/bin/env python3
import subprocess
import sys
import time
import os

def install_bmad():
    # Start the installation process
    proc = subprocess.Popen(
        ['cmd', '/c', 'npx', 'bmad-method@alpha', 'install'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=0
    )

    try:
        # Wait a bit for the first prompt
        time.sleep(2)

        # Send Enter to accept default directory
        proc.stdin.write('\n')
        proc.stdin.flush()

        # Wait for confirmation prompt
        time.sleep(2)

        # Send 'Y' to confirm installation to existing directory
        proc.stdin.write('Y\n')
        proc.stdin.flush()

        # Wait for installation type selection
        time.sleep(2)

        # Send '2' to select modify installation (assuming option 2)
        proc.stdin.write('2\n')
        proc.stdin.flush()

        # Read the output
        stdout, stderr = proc.communicate(timeout=60)

        print("STDOUT:")
        print(stdout)
        print("\nSTDERR:")
        print(stderr)

    except subprocess.TimeoutExpired:
        proc.kill()
        print("Installation timed out")
    except Exception as e:
        print(f"Error: {e}")
        proc.kill()

if __name__ == "__main__":
    install_bmad()