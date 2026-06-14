import docker

# Connect to Docker on your machine
client = docker.from_env()

def deploy_contestant(code_path: str):
    print(f"[*] Deploying contestant code from: {code_path}")
    
    # Run the contestant's code in a safe Docker container
    container = client.containers.run(
        image="python:3.11-slim",   # Use a lightweight Python container
        command=f"python /app/solution.py",  # Run their code
        volumes={
            code_path: {             # Mount their code folder into the container
                'bind': '/app',
                'mode': 'ro'         # Read-only so they can't escape!
            }
        },
        mem_limit="256m",            # Max 256MB RAM
        cpuset_cpus="0",             # Pin to CPU core 0 only
        ports={"8080/tcp": 8080},    # Expose port 8080
        detach=True,                 # Run in background
        name="contestant_sandbox"    # Give it a name
    )
    
    print(f"[+] Container started! ID: {container.id[:12]}")
    print(f"[+] Contestant code is live at: ws://127.0.0.1:8080")
    return container

def stop_contestant():
    print("[*] Stopping contestant container...")
    try:
        container = client.containers.get("contestant_sandbox")
        container.stop()
        container.remove()
        print("[+] Container stopped and removed!")
    except docker.errors.NotFound:
        print("[!] No container found to stop.")

# Test it
if __name__ == "__main__":
    deploy_contestant("C:/Users/medas/iicpc-platform")