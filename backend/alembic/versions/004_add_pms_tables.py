"""Add PMS tables (project_template, project_request, project_file)

Revision ID: 004_add_pms_tables
Revises: 003_add_content_table
Create Date: 2024-12-03 21:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision: str = '004_add_pms_tables'
down_revision: Union[str, None] = '003_content'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create project_template table
    op.create_table(
        'projecttemplate',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('category', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('tech_stack', sa.String(), nullable=False, server_default='[]'),
        sa.Column('price', sa.Float(), nullable=True),
        sa.Column('time_duration', sa.String(), nullable=False),
        sa.Column('requirements', sa.String(), nullable=False, server_default=''),
        sa.Column('demo_images', sa.String(), nullable=False, server_default='[]'),
        sa.Column('demo_video', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create project_request table
    op.create_table(
        'projectrequest',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=False),
        sa.Column('college_company', sa.String(), nullable=False),
        sa.Column('project_template_id', sa.Integer(), nullable=True),
        sa.Column('custom_category', sa.String(), nullable=True),
        sa.Column('custom_description', sa.String(), nullable=False),
        sa.Column('deadline', sa.DateTime(), nullable=True),
        sa.Column('status', sa.String(), nullable=False, server_default='pending'),
        sa.Column('assigned_to', sa.String(), nullable=True),
        sa.Column('progress', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('price', sa.Float(), nullable=True),
        sa.Column('payment_status', sa.String(), nullable=False, server_default='pending'),
        sa.Column('notes', sa.String(), nullable=False, server_default=''),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create project_file table
    op.create_table(
        'projectfile',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('request_id', sa.Integer(), nullable=False),
        sa.Column('file_url', sa.String(), nullable=False),
        sa.Column('file_type', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('uploaded_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('projectfile')
    op.drop_table('projectrequest')
    op.drop_table('projecttemplate')
