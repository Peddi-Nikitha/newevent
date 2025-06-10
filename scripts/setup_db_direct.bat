@echo off
echo Installing required Python packages...
pip install -r scripts/requirements.txt

echo Setting up database with hardcoded connection string...
python scripts/db_setup_direct.py

echo Done!
pause 