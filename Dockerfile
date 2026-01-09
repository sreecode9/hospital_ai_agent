FROM python:3.11-slim

# Set environment variables
ENV SUPABASE_DISABLE_PROXY=true
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "start.py"]