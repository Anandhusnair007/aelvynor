"""Add content table for website content management

Revision ID: 003_content
Revises: 002_add_status
Create Date: 2024-12-03 22:01:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '003_content'
down_revision = '002_add_status'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create content table
    op.create_table(
        'content',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('hero_title', sa.String(), nullable=False, server_default=''),
        sa.Column('hero_subtitle', sa.String(), nullable=False, server_default=''),
        sa.Column('footer_text', sa.String(), nullable=False, server_default=''),
        sa.Column('contact_email', sa.String(), nullable=False, server_default=''),
        sa.Column('contact_phone', sa.String(), nullable=False, server_default=''),
        sa.Column('contact_address', sa.String(), nullable=False, server_default=''),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    # Drop content table
    op.drop_table('content')

