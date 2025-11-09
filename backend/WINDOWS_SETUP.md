# Windows Setup Guide

## Quick Installation

### Step 1: Upgrade pip
```bash
py -m pip install --upgrade pip
```

### Step 2: Install requirements
```bash
cd backend
py -m pip install -r requirements.txt
```

### Step 3: Run the server
```bash
py main.py
```

## If You Still Get Rust Errors

If you encounter Rust/Cargo compilation errors, try these solutions in order:

### Solution A: Use Pre-built Wheels Only
```bash
py -m pip install --upgrade pip wheel
py -m pip install --only-binary=:all: -r requirements.txt
```

### Solution B: Install Minimal Dependencies
Create a minimal environment first:
```bash
py -m pip install fastapi uvicorn
py main.py
```

Then install additional packages:
```bash
py -m pip install pydantic pydantic-settings python-multipart reportlab python-dotenv
```

### Solution C: Install Microsoft C++ Build Tools (if needed)
If packages still require compilation:
1. Download and install Visual Studio Build Tools from:
   https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
2. During installation, select "Desktop development with C++"
3. Retry: `py -m pip install -r requirements.txt`

## Virtual Environment (Recommended)

### Create virtual environment
```bash
cd backend
py -m venv venv
```

### Activate virtual environment
```bash
venv\Scripts\activate
```

### Install dependencies in virtual environment
```bash
py -m pip install --upgrade pip
py -m pip install -r requirements.txt
```

### Run the server
```bash
py main.py
```

### Deactivate when done
```bash
deactivate
```

## Running Tests

```bash
py -m pytest test_calculations.py -v
```

## Common Issues

### Issue: "Python not found"
**Solution**: Use `py` instead of `python`:
```bash
py main.py
```

### Issue: "cryptography requires Rust"
**Solution**: Update pip and use pre-built wheels:
```bash
py -m pip install --upgrade pip setuptools wheel
py -m pip install --only-binary=:all: -r requirements.txt
```

### Issue: Port 8000 already in use
**Solution**: Kill the process or use a different port:
```bash
py main.py --port 8001
```

Or modify main.py to use a different port.

## Verify Installation

Test if the server works:
```bash
py main.py
```

You should see:
```
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Open browser to: http://localhost:8000/docs

## Production Deployment

```bash
py -m uvicorn main:app --host 0.0.0.0 --port 8000
```
