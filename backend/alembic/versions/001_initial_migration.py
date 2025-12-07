"""Initial migration - create all tables

Revision ID: 001_initial
Revises: 
Create Date: 2024-12-03 21:45:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSON as PG_JSON

# JSON type that works with both SQLite (TEXT) and PostgreSQL (JSON)
# SQLAlchemy automatically handles JSON as TEXT in SQLite and JSON in PostgreSQL
JSONType = sa.JSON().with_variant(sa.Text(), 'sqlite')

# revision identifiers, used by Alembic.
revision = '001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create admins table
    op.create_table(
        'admins',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=200), nullable=True),
        sa.Column('full_name', sa.String(length=200), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('is_superuser', sa.Boolean(), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('last_login', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_admins_username'), 'admins', ['username'], unique=True)
    
    # Create projects table
    op.create_table(
        'projects',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('image_url', sa.String(), nullable=True),
        sa.Column('images', JSONType, nullable=True),
        sa.Column('github_url', sa.String(), nullable=True),
        sa.Column('live_url', sa.String(), nullable=True),
        sa.Column('technologies', JSONType, nullable=True),
        sa.Column('features', JSONType, nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_projects_title'), 'projects', ['title'], unique=False)
    
    # Create courses table
    op.create_table(
        'courses',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('instructor', sa.String(), nullable=True),
        sa.Column('duration', sa.String(), nullable=True),
        sa.Column('price', sa.Float(), nullable=True),
        sa.Column('image_url', sa.String(), nullable=True),
        sa.Column('images', JSONType, nullable=True),
        sa.Column('features', JSONType, nullable=True),
        sa.Column('curriculum', JSONType, nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_courses_title'), 'courses', ['title'], unique=False)
    
    # Create internships table
    op.create_table(
        'internships',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('company', sa.String(), nullable=True),
        sa.Column('location', sa.String(), nullable=True),
        sa.Column('duration', sa.String(), nullable=True),
        sa.Column('stipend', sa.Float(), nullable=True),
        sa.Column('image_url', sa.String(), nullable=True),
        sa.Column('images', JSONType, nullable=True),
        sa.Column('requirements', JSONType, nullable=True),
        sa.Column('benefits', JSONType, nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_internships_title'), 'internships', ['title'], unique=False)
    
    # Create products table
    op.create_table(
        'products',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('price', sa.Float(), nullable=False),
        sa.Column('image_url', sa.String(), nullable=True),
        sa.Column('images', JSONType, nullable=True),
        sa.Column('stock', sa.Integer(), nullable=False),
        sa.Column('category', sa.String(), nullable=True),
        sa.Column('features', JSON().with_variant(sa.Text(), 'sqlite'), nullable=True),
        sa.Column('specifications', JSONType, nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_products_name'), 'products', ['name'], unique=False)
    
    # Create applications table
    op.create_table(
        'applications',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('full_name', sa.String(length=200), nullable=False),
        sa.Column('email', sa.String(length=200), nullable=False),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('resume_url', sa.String(), nullable=True),
        sa.Column('cover_letter', sa.Text(), nullable=True),
        sa.Column('position_type', sa.String(length=50), nullable=False),
        sa.Column('position_id', sa.Integer(), nullable=True),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('notes', JSONType, nullable=True),
        sa.Column('metadata', JSONType, nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_applications_email'), 'applications', ['email'], unique=False)


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_index(op.f('ix_applications_email'), table_name='applications')
    op.drop_table('applications')
    
    op.drop_index(op.f('ix_products_name'), table_name='products')
    op.drop_table('products')
    
    op.drop_index(op.f('ix_internships_title'), table_name='internships')
    op.drop_table('internships')
    
    op.drop_index(op.f('ix_courses_title'), table_name='courses')
    op.drop_table('courses')
    
    op.drop_index(op.f('ix_projects_title'), table_name='projects')
    op.drop_table('projects')
    
    op.drop_index(op.f('ix_admins_username'), table_name='admins')
    op.drop_table('admins')

