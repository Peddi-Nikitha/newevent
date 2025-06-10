@echo off
echo Installing required Python packages...
pip install -r scripts/requirements.txt

echo Setting up database...
python scripts/db_setup.py

echo Done!
pause 