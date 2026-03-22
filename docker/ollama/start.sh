#!/bin/sh

echo "Starting Ollama server..."

ollama serve &

echo "Waiting for Ollama API..."

sleep 8

echo "Downloading models..."

ollama pull llama3.1:8b
ollama pull mistral-nemo:latest
ollama pull gemma3:12b


echo "Models ready."

wait