import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

/**
 * POST /api/crm/surveys/:id/respond
 * Submit survey responses
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const surveyId = parseInt(params.id);
    const body = await request.json();
    const { case_id, contact_id, responses } = body;

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json(
        { error: 'responses array is required' },
        { status: 400 }
      );
    }

    // Check if survey exists
    const surveyCheck = await pool.query(
      'SELECT survey_id, survey_type FROM crm_surveys WHERE survey_id = $1 AND is_active = true',
      [surveyId]
    );
    if (surveyCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Survey not found' },
        { status: 404 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Insert all responses
      const insertedResponses = [];
      for (const response of responses) {
        const { question_id, rating_value, text_value, choice_value } = response;

        const insertQuery = `
          INSERT INTO crm_survey_responses (
            survey_id, question_id, case_id, contact_id,
            rating_value, text_value, choice_value
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `;

        const result = await client.query(insertQuery, [
          surveyId,
          question_id,
          case_id,
          contact_id,
          rating_value,
          text_value,
          choice_value,
        ]);

        insertedResponses.push(result.rows[0]);
      }

      // If this is for a case and includes a CSAT rating, update the case
      if (case_id) {
        const csatResponse = responses.find(r => r.rating_value !== undefined && r.rating_value !== null);
        if (csatResponse) {
          const textResponse = responses.find(r => r.text_value);
          
          await client.query(
            `UPDATE crm_cases 
             SET csat_score = $1,
                 csat_comment = $2,
                 csat_submitted_at = CURRENT_TIMESTAMP
             WHERE case_id = $3`,
            [csatResponse.rating_value, textResponse?.text_value || null, case_id]
          );
        }
      }

      await client.query('COMMIT');

      return NextResponse.json({
        message: 'Survey responses submitted successfully',
        responses: insertedResponses,
      }, { status: 201 });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error submitting survey:', error);
    return NextResponse.json(
      { error: 'Failed to submit survey responses' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/crm/surveys/:id/respond
 * Get survey questions for response
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const surveyId = parseInt(params.id);

    // Get survey details
    const surveyQuery = `
      SELECT * FROM crm_surveys
      WHERE survey_id = $1 AND is_active = true
    `;
    const surveyResult = await pool.query(surveyQuery, [surveyId]);
    
    if (surveyResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Survey not found' },
        { status: 404 }
      );
    }

    // Get questions
    const questionsQuery = `
      SELECT * FROM crm_survey_questions
      WHERE survey_id = $1 AND is_active = true
      ORDER BY question_order
    `;
    const questionsResult = await pool.query(questionsQuery, [surveyId]);

    return NextResponse.json({
      survey: surveyResult.rows[0],
      questions: questionsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching survey:', error);
    return NextResponse.json(
      { error: 'Failed to fetch survey' },
      { status: 500 }
    );
  }
}
