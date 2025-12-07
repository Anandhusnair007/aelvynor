import sys
from pathlib import Path
import json

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlmodel import Session, create_engine, select
from app.config import settings
from app.models import create_db_and_tables, Project, Course, Internship, Product, Mission

def seed_data():
    engine = create_engine(settings.DATABASE_URL)
    create_db_and_tables(engine)
    
    with Session(engine) as session:
        # Check if data exists
        if session.exec(select(Project)).first():
            print("Data already seeded!")
            return

        # Mission
        mission = Mission(
            short="Aelvynor modernizes rubber tapping with engineering, training, and market-ready machines.",
            long="Aelvynor is a Kerala Startup Mission Seed Fund supported company developing automation technologies for rubber tapping farmers in Kerala. Our mission is to empower plantation workers through engineering, skill development, and next-generation machinery. We provide courses, live projects, internships, and career pathways for engineering students."
        )
        session.add(mission)

        # Projects
        projects = [
            Project(
                title="Automatic Rubber Tapping Optimization",
                slug="rubber-tapping-optimization",
                description="Aelvynor modernizes rubber tapping with engineering, training, and market-ready rubber tapping machines.",
                full_description="""
                Aelvynor is proud to be incubated under the Kerala Startup Mission, focusing on bringing automation to the traditional rubber plantations of Kerala. 
                
                Our flagship project involves the development of an automated rubber tapping system designed specifically for smallholders. This system utilizes advanced sensors and custom firmware to ensure precise tapping depth, minimizing tree damage and maximizing latex yield.
                
                The project has undergone extensive field tests in Kottayam and Pathanamthitta districts, showing a 15% increase in yield and significant reduction in labor costs. The system includes a dashboard for plantation owners to monitor yield and tree health in real-time.
                """,
                tags=json.dumps(["IoT", "Automation", "Agriculture", "Embedded Systems"]),
                features=json.dumps(["Precision Tapping", "Solar Powered", "Rain Guard Compatible", "Mobile App Control"]),
                image="/examples/tap1.jpg"
            ),
            Project(
                title="IoT Smart Farming Node",
                slug="iot-smart-farming-node",
                description="A modular IoT node for monitoring soil moisture, temperature, and humidity.",
                full_description="This project focuses on creating a low-cost, energy-efficient IoT node that can be deployed in large numbers across a farm. It uses LoRaWAN for long-range communication and solar harvesting for power.",
                tags=json.dumps(["IoT", "LoRaWAN", "Sensors"]),
                features=json.dumps(["Soil Moisture Sensing", "Temperature/Humidity", "Solar Harvesting", "Long Range"]),
                image="/examples/iot_node.jpg"
            ),
            Project(
                title="Vision-Based Crop Monitoring AI",
                slug="vision-crop-monitoring",
                description="Using computer vision to detect diseases and pests in crops early.",
                full_description="Leveraging modern CNN architectures, this system analyzes images captured by drones or smartphones to identify common crop diseases with high accuracy, enabling targeted intervention.",
                tags=json.dumps(["AI", "Computer Vision", "Python"]),
                features=json.dumps(["Disease Detection", "Pest Identification", "Yield Estimation", "Mobile Integration"]),
                image="/examples/vision_ai.jpg"
            )
        ]
        
        for p in projects:
            session.add(p)
            
        # Courses
        courses = [
            Course(
                title="AI & LLM Engineering",
                description="We teach what we actually use in our own engineering teams: Modern AI & LLM workflows. Learn the tech stacks companies expect from day one — not outdated theory.",
                level="Advanced",
                duration="12 weeks",
                students_count=150
            ),
            Course(
                title="Full Stack + DevOps",
                description="Cloud & DevOps pipelines. Python & Full Stack Engineering. Real-world hardware-software integration.",
                level="Intermediate",
                duration="16 weeks",
                students_count=300
            ),
            Course(
                title="IoT & Embedded Systems",
                description="IoT & Embedded Systems. Learn to design and build connected hardware devices from scratch with real-world applications.",
                level="Beginner",
                duration="10 weeks",
                students_count=200
            )
        ]
        
        for c in courses:
            session.add(c)
            
        # Internships
        internships = [
            Internship(
                role="Hardware Engineering Intern",
                department="Hardware",
                location="Kochi, Kerala",
                type="On-site",
                description="Work with our KSUM-backed engineering team. Build real products. Solve real engineering challenges. Get real experience. Top performers move directly into full-time roles inside Aelvynor — no exam, no fee, no shortcuts. Just pure skill."
            ),
            Internship(
                role="Software Engineering Intern",
                department="Software",
                location="Remote",
                type="Remote",
                description="Work with our KSUM-backed engineering team. Build real products. Solve real engineering challenges. Get real experience. Top performers move directly into full-time roles inside Aelvynor — no exam, no fee, no shortcuts. Just pure skill."
            ),
            Internship(
                role="DevOps Cloud Intern",
                department="Infrastructure",
                location="Remote",
                type="Remote",
                description="Work with our KSUM-backed engineering team. Build real products. Solve real engineering challenges. Get real experience. Top performers move directly into full-time roles inside Aelvynor — no exam, no fee, no shortcuts. Just pure skill."
            )
        ]
        
        for i in internships:
            session.add(i)
            
        # Products
        products = [
            Product(
                name="Aelvynor Rubber Tapping Machine",
                description="The world's most advanced automated rubber tapping solution for smallholders.",
                features=json.dumps([
                    "Adaptive tapping depth",
                    "Battery powered",
                    "Sensor-driven precision",
                    "Zero-maintenance design"
                ]),
                specs=json.dumps({
                    "weight": "12kg",
                    "battery": "10Ah",
                    "power": "12V DC"
                })
            )
        ]
        
        for p in products:
            session.add(p)
            
        session.commit()
        print("Seed data injected successfully!")

if __name__ == "__main__":
    seed_data()
