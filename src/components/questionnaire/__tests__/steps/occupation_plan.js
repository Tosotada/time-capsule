import React from 'react'
import { render, fireEvent, wait } from 'react-testing-library'

describe('Questionnaire -- Occupation Plan', () => {
  jest.doMock(`../../../shared/hooks/useQuestionnaire`, () => {
    return () => window.getQuestionnaireContext('OCCUPATION_PLAN')
  })

  const OccupationPlan = require('../../index').default

  test('Should render a single textarea and a disabled next button.', async () => {
    const { getByTestId } = render(<OccupationPlan />)
    const nextButton = getByTestId('next-button')

    const textarea = getByTestId('textarea')
    expect(textarea).toBeInTheDocument()
    expect(nextButton).toHaveAttribute('disabled')

    fireEvent.change(textarea, {
      target: {
        value: 'This is a test! 🤓',
      },
    })
    await wait(() => {
      expect(nextButton).not.toHaveAttribute('disabled')
    })
  })
})
