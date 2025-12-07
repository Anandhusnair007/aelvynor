"""Add status column to application table

Revision ID: 002_add_status
Revises: 001_initial
Create Date: 2024-12-03 22:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '002_add_status'
down_revision = None  # Set to None if 001_initial doesn't exist, or check current migrations
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add status column to application table with default value
    # Check if column exists first (for SQLite compatibility)
    try:
        op.add_column('application', sa.Column('status', sa.String(), nullable=False, server_default='pending'))
    except Exception:
        # Column might already exist, try to update existing NULL values
        op.execute("UPDATE application SET status = 'pending' WHERE status IS NULL OR status = ''")


def downgrade() -> None:
    # Remove status column
    op.drop_column('application', 'status')

