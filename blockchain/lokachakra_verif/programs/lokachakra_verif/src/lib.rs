use anchor_lang::prelude::*;

declare_id!("GbMMLzLoDwSjk7R5dgFh3i5dUPcaqkHtBXF4NyhZFtjw"); // Using existing Program ID

#[program]
pub mod lokachakra_verif {
    use super::*;

    pub fn initialize_employee(ctx: Context<InitializeEmployee>, employee_hash: [u8; 32], company_id: String) -> Result<()> {
        let employee = &mut ctx.accounts.employee_account;
        employee.employee_hash = employee_hash;
        employee.company_id = company_id;
        employee.onboarding_status = OnboardingStatus::Pending; // Default status
        employee.created_at = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn record_document_proof(ctx: Context<RecordDocumentProof>, document_hash: [u8; 32]) -> Result<()> {
        let proof = &mut ctx.accounts.document_proof;
        proof.employee_hash = ctx.accounts.employee_account.employee_hash;
        proof.document_hash = document_hash;
        proof.verified = true; // Auto-verify for now as per flow, or false if 2-step
        proof.verified_by = *ctx.accounts.authority.key;
        proof.timestamp = Clock::get()?.unix_timestamp;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(employee_hash: [u8; 32], company_id: String)]
pub struct InitializeEmployee<'info> {
    #[account(
        init,
        seeds = [b"employee", employee_hash.as_ref()],
        bump,
        payer = authority,
        space = 8 + 32 + 50 + 2 + 8 // Discriminator + Hash + Max Company ID + Enum + Timestamp
    )]
    pub employee_account: Account<'info, EmployeeAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(document_hash: [u8; 32])]
pub struct RecordDocumentProof<'info> {
    #[account(
        init,
        seeds = [b"proof", document_hash.as_ref()],
        bump,
        payer = authority,
        space = 8 + 32 + 32 + 1 + 32 + 8
    )]
    pub document_proof: Account<'info, DocumentProof>,
    #[account(mut)]
    pub employee_account: Account<'info, EmployeeAccount>, // Link validation
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct EmployeeAccount {
    pub employee_hash: [u8; 32],
    pub company_id: String,
    pub onboarding_status: OnboardingStatus,
    pub created_at: i64,
}

#[account]
pub struct DocumentProof {
    pub employee_hash: [u8; 32], // Link back to employee
    pub document_hash: [u8; 32], 
    pub verified: bool,
    pub verified_by: Pubkey,
    pub timestamp: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum OnboardingStatus {
    Pending,
    Verified,
    Active,
}
