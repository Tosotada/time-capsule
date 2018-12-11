import React, { useState, useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { screenmd, UnstyledButton } from '../shared/styles'
import { Location } from '@reach/router'

import caretLeft from '../../images/caret-left.svg'

import About from './steps/about/index'
import Occupation from './steps/occupation/index'
import OccupationPlan from './steps/occupation/occupation-plan'

import useQuestionnaire from '../shared/hooks/useQuestionnaire'

import Transition, { WizardTransition } from '../shared/transition'

const questionnaireSteps = [
  {
    id: 'ABOUT',
    data: {
      component: About,
      meta: {
        sectionTitle: 'About',
        question: 'What is your name?',
      },
    },
  },
  {
    id: 'OCCUPATION_INFO',
    data: {
      component: Occupation,
      meta: {
        sectionTitle: 'Work/Education',
        question: 'I am currently a',
      },
    },
  },
  {
    id: 'OCCUPATION_PLAN',
    data: {
      component: OccupationPlan,
      meta: {
        sectionTitle: 'Work/Education',
        question: 'What will you do to improve your work?',
      },
    },
  },
  {
    id: 'OCCUPATION_HAPPINESS',
    data: {
      component: Occupation,
      meta: {
        sectionTitle: 'About',
        question: 'working at...',
      },
    },
  },
]

export default React.memo(props => {
  const initialFocusRef = useRef()
  const [canContinue, setContinue] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState(
    'horizontal-left'
  )
  const { context } = useQuestionnaire()

  const index = questionnaireSteps.findIndex(
    step => step.id === context.questionnaireState.meta.currentStepId
  )
  const {
    data: { component: Component, meta },
  } = questionnaireSteps[index]

  useEffect(
    () => {
      initialFocusRef.current.focus()
    },
    [context.questionnaireState.meta.currentStepId]
  )

  return (
    <Location>
      {({ navigate }) => (
        <Container>
          <DescriptionHeader>
            <BackButton
              ref={initialFocusRef}
              onClick={
                index === 0
                  ? e => navigate('/')
                  : e => {
                      if (canContinue) setContinue(false)

                      if (transitionDirection !== 'horizontal-right') {
                        setTransitionDirection('horizontal-right')
                      }

                      context.questionnaireDispatch({
                        type: 'NEXT',
                        payload: {
                          value: questionnaireSteps[index - 1].id,
                        },
                      })
                    }
              }
              aria-label="go back"
            />
            <p>{meta.sectionTitle}</p>
          </DescriptionHeader>
          <Transition
            transitionKey={context.questionnaireState.meta.currentStepId}
          >
            <Question>{meta.question}</Question>
          </Transition>
          <WizardTransition
            transitionKey={context.questionnaireState.meta.currentStepId}
            type={transitionDirection}
          >
            <UserInteractionSection>
              <Component canContinue={canContinue} setContinue={setContinue} />
            </UserInteractionSection>
          </WizardTransition>
          {index !== questionnaireSteps.length - 1 && (
            <NextButton
              disabled={!canContinue}
              onClick={e => {
                if (transitionDirection !== 'horizontal-left') {
                  setTransitionDirection('horizontal-left')
                }
                context.questionnaireDispatch({
                  type: 'NEXT',
                  payload: {
                    value: questionnaireSteps[index + 1].id,
                  },
                })
                if (canContinue) setContinue(false)
              }}
            >
              <span>Next</span>
            </NextButton>
          )}
        </Container>
      )}
    </Location>
  )
})

const Container = styled.section`
  max-width: 400px;
  width: 100%;
  margin: 80px auto;
`

const DescriptionHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 40px;

  > p {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    font-size: var(--fontsm);
    font-weight: var(--fontbold);
    text-transform: uppercase;
    color: var(--black2);
  }
`

const BackButton = styled(UnstyledButton)`
  padding: 0;
  font-size: 0;
  padding: 5px 5px 4px 5px;
  margin-left: -5px;
  cursor: w-resize;
  outline: none;
  &::before {
    content: '';
    height: var(--fontsm);
    width: var(--fontsm);
    background: var(--black);
    display: block;
    -webkit-mask: url(${caretLeft}) center center / contain no-repeat;
    mask: url(${caretLeft}) center center / contain no-repeat;
  }

  &::after {
    content: '';
    box-shadow: 0 0 1px var(--gray2);
    border-radius: var(--baseborderradius);
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transform: scale(0.7);
    transition: transform 0.1s ease-in;
  }

  &:hover {
    > div {
      opacity: 1;
    }
  }

  &:focus {
    &::after {
      opacity: 1;
      transform: scale(1.05);
    }
  }

  &:active {
    > div {
      opacity: 0.7;
    }
    &::after {
      opacity: 0.7;
      transform: scale(0.95);
    }
  }
`

const Question = styled.h1`
  margin: 0 0 40px 0;
  font-size: var(--fontlg);
  font-family: var(--ff-serif);
  text-align: center;
  color: var(--black);
`

const UserInteractionSection = styled.div`
  min-height: 300px;
  height: 100%;
  margin: 5rem 0 2.5rem 0;
  display: grid;
  grid-auto-rows: max-content;
`

export const NextButton = styled(UnstyledButton)`
  padding: var(--fontmd);
  width: 100%;
  background: transparent;
  border-radius: var(--baseborderradius);
  font-weight: var(--fontbold);
  color: var(--white);
  cursor: pointer;
  transition: transform 0.15s ease-in;
  overflow: hidden;
  outline: none;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--gray1);
    z-index: -1;
    transition: 0.25s ease-in;
    transition-property: transform;
    transform: ${props => (props.disabled ? 'scaleX(1)' : 'scaleX(0)')};
    transform-origin: ${props => (props.disabled ? '0 50%' : '100% 50%')};
  }

  > span {
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    &::before {
      background: var(--blue1);
      z-index: -2;
    }
    &::after {
      background: var(--blue);
      z-index: -2;
      transition: opacity 0.1s ease-in;
    }
  }

  ${props =>
    !props.disabled &&
    css`
      &:hover,
      &:focus {
        transform: translateY(-1px);
        > span::after {
          opacity: 0;
        }
      }
      &:active {
        transform: translateY(1px);
        > span::after {
          opacity: 1;
        }
      }
    `};

  @media (max-width: ${screenmd}px) {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
  }
`
