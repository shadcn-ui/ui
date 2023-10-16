import React, { useState, useCallback } from 'react';
import { cva, type VariantProps, } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Icon, IconType } from "./icon"
import { Input } from './input';
import { colors } from './helper/types';


const textAreaVariants = cva(
  "block w-full rounded-md border-0 py-1.5 pl-3  ring-1 ring-inset focus:ring-2 focus:ring-inset ",
  {
    variants: {
      variant: {
        outline:
          "border border-input placeholder:text-primary/50 focus:ring-0 ring-0 "

      },
      size: {
        xs: "text-xs leading-4 ",
        sm: "text-sm leading-5 ",
        default: "text-base leading-6 ",
        lg: "text-lg leading-7 ",
        xl: "text-xl leading-8 "
      },
      textareavariant: {
        default: "resize-none p-0 pb-2 ring-0 focus:ring-0 ",
        borderForInput: "resize-none  py-0 border-t-0 border-b-0 border-l-0 border-r-0",
      }
    },
    defaultVariants: {
      variant: "outline",
      size: "default"
    },
  }
)
const textAreaButtonVariants = cva(
  " rounded-md px-3 py-1.5 font-medium",
  {
    variants: {
      textAreaButtonvariant: {
        outline: " border-input ",
      },
      size: {
        xs: "text-xs leading-4 ",
        sm: "text-sm leading-5 ",
        default: "text-base leading-6 ",
        lg: "text-lg leading-7 ",
        xl: "text-xl leading-8 "
      },
      showMoodButton: {
        default: "relative py-0 px-0 -m-2 inline-flex h-6 w-10 items-center justify-center rounded-full ",
        resultButton: "inline-flex items-center py-2 font-semibold shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
      },
    },
    defaultVariants: {
      textAreaButtonvariant: "outline",
      size: "default"
    },
  }
)



const textAreaListVariants = cva(
  " absolute right-0 z-10 mt-1 overflow-auto rounded-lg py-3 shadow",
  {
    variants: {
      size: {
        default: " w-52 text-sm ",
      },
    },
    defaultVariants: {
      size: "default"
    },
  }
)

interface AssignListItem {
  label?: string | undefined;
  image?: string | undefined;
}

interface IconList {
  icon?: IconType;
  bg?: string;
  height?: string;
  width?: string;
}
interface LabelListItem {
  label?: string;
}
interface DueDateListItem {
  label?: string;
}
// export interface IconsList {
//   icon?: IconType;
// }
export interface ButtonList {
  bg?: string;
  label?: string;
  icon?: IconType;
  height?: string;
  width?: string;
}
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  VariantProps<typeof textAreaVariants> {
  asChild?: boolean;
  label?: string | undefined;
  imageSrc?: string | undefined;
  showIconListForTextArea?: boolean | undefined;
  firstButtonText?: string | undefined;
  secondButtonText?: string | undefined;
  submitButton?: string | undefined;
  showMoodButton?: 'default' | "resultButton";
  textAreaButtonvariant?: "outline";
  placeholder?: string | undefined;
  variant?: 'outline';
  textareavariant?: 'default' | 'borderForInput';
  icons?: IconType[] | undefined;
  icon?: IconType | undefined;
  titlePlaceholder?: string | undefined;
  hasDivider?: boolean | undefined;
  assignList?: AssignListItem[] | undefined;
  assignButtonName?: string | undefined;
  labelButtonName?: string | undefined;
  labelList?: LabelListItem[] | undefined;
  dueDateButtonName?: string | undefined;
  dueDateList?: DueDateListItem[] | undefined;
  attachIcon?: IconType | undefined;
  dividerText?: string | undefined;
  iconList?: ButtonList[] | undefined;
  buttonContent?: string | undefined;
  createButton?: string | undefined;
  iconStyle?: string | undefined;
  buttonText?: string | undefined;
  textColor?: colors;
  imageStyle?: string;
  actionIcons?: IconType[];
}


const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ showIconListForTextArea, imageSrc, imageStyle, textColor, actionIcons, buttonText, iconList, iconStyle, createButton, dividerText, buttonContent, labelList, attachIcon, dueDateList, dueDateButtonName, assignList, labelButtonName, assignButtonName, hasDivider, titlePlaceholder, icon, variant, icons, textareavariant, placeholder, showMoodButton, textAreaButtonvariant, secondButtonText, submitButton, firstButtonText, label, className, ...props }, ref) => {
    const [showComment, setShowComment] = useState(false);
    const [showWrite, setShowWrite] = useState(false);
    const [showIcon, setShowIcon] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState<IconList | null>(null);
    const [isListVisible, setIsListVisible] = useState(false);
    const [isLabelListVisible, setIsLabelListVisible] = useState(false);
    const [isDueDateListVisible, setIsDueDateListVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState<AssignListItem | null>(null);
    const [selectedLabelOption, setSelectedLabelOption] = useState<LabelListItem | null>(null);
    const [selectedDueDateOption, setSelectedDueDateOption] = useState<DueDateListItem | null>(null);

    const memoizedSetShowComment = useCallback((value: boolean) => setShowComment(value), []);
    const memoizedSetShowWrite = useCallback((value: boolean) => setShowWrite(value), []);
    const memoizedSetSelectedIcon = useCallback((value: IconList) => setSelectedIcon(value), []);
    const memoizedSetSelectedOption = useCallback((value: AssignListItem) => setSelectedOption(value), []);
    const memoizedSetSelectedLabelOption = useCallback((value: LabelListItem) => setSelectedLabelOption(value), []);
    const memoizedSetSelectedDueDateOption = useCallback((value: DueDateListItem) => setSelectedDueDateOption(value), []);


    const buttonColor = (textColor?: string) => {
      return ` bg-${textColor}-600 text-primary-foreground`
    }

    const memoizedHandleCommentButtonClick = useCallback(() => {
      memoizedSetShowComment(true);
      memoizedSetShowWrite(false);
    }, [memoizedSetShowComment, memoizedSetShowWrite]);

    const memoizedHandleWriteButtonClick = useCallback(() => {
      memoizedSetShowWrite(true);
      memoizedSetShowComment(false);
    }, [memoizedSetShowWrite, memoizedSetShowComment]);

    const memoizedHandleIconClick = useCallback(() => {
      setShowIcon(prev => !prev);
    }, []);

    const memoizedHandleIconButtonClick = useCallback((icon: any) => {
      memoizedSetSelectedIcon(icon);
      memoizedHandleIconClick();
    }, [memoizedSetSelectedIcon, memoizedHandleIconClick]);

    const memoizedToggleListVisibility = useCallback(() => {
      setIsListVisible(prev => !prev);
      setIsLabelListVisible(false);
      setIsDueDateListVisible(false);
    }, []);

    const memoizedHandleOptionClick = useCallback((option: any) => {
      memoizedSetSelectedOption(option);
      memoizedToggleListVisibility();
    }, [memoizedSetSelectedOption, memoizedToggleListVisibility]);

    const memoizedToggleLabelListVisibility = useCallback(() => {
      setIsLabelListVisible(prev => !prev);
      setIsListVisible(false);
      setIsDueDateListVisible(false);
    }, []);

    const memoizedHandleLabelOptionClick = useCallback((option: any) => {
      memoizedSetSelectedLabelOption(option);
      memoizedToggleLabelListVisibility();
    }, [memoizedSetSelectedLabelOption, memoizedToggleLabelListVisibility]);

    const memoizedToggleDueDateListVisibility = useCallback(() => {
      setIsDueDateListVisible(prev => !prev);
      setIsListVisible(false);
      setIsLabelListVisible(false);
    }, []);

    const memoizedHandleDueDateOptionClick = useCallback((option: any) => {
      memoizedSetSelectedDueDateOption(option);
      memoizedToggleDueDateListVisibility();
    }, [memoizedSetSelectedDueDateOption, memoizedToggleDueDateListVisibility]);


    return (
      <>
        <div className={cn("flex items-start space-x-4", className)}>
          {
            imageSrc ?
              <div className={cn("flex-shrink-0")}>
                <img className={cn("inline-block flex-shrink-0 rounded-full h-10 w-10", `${imageStyle}`, className)} src={imageSrc} />
              </div>
              : ""
          }
          <div className={cn("min-w-0 flex-1", className)}>
            {
              firstButtonText ?
                <div className={cn("flex items-center", className)}>
                  <button
                    className={cn(textAreaButtonVariants({}))}
                    onClick={memoizedHandleWriteButtonClick}>
                    {firstButtonText}
                  </button>

                  <button
                    className={cn(textAreaButtonVariants({}))}
                    onClick={memoizedHandleCommentButtonClick}>
                    {secondButtonText}
                  </button>

                  <div className={cn("ml-auto flex items-center space-x-5", className)}>

                    {showWrite && (
                      <div className={cn("ml-auto flex items-center space-x-5", className)}>
                        {icons && icons.map((icon: IconType, index: number) => (
                          <div key={index} className={cn("flex items-center", className)}>
                            <button
                              className={cn("inline-flex items-center justify-center rounded-full", className)} >
                              <Icon name={icon} className={cn(`h-5 w-5 text-primary/50 ${iconStyle}`, className)} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                : ""
            }
            {label ? <label className={cn("block leading-6 text-base", className)}>{label}</label> : ''}
            <div className={cn(` rounded-lg ${showComment ? "border-0" : "border shadow-sm"}`, className)}>
              {titlePlaceholder ? <Input className={cn("block border-0 shadow-none text-lg font-medium", className)} placeholder={titlePlaceholder} /> : null}
              {showComment && (
                <div className={cn("mt-2", className)}>
                  <div className={cn(" rounded-lg p-0.5", className)}>
                    <div className={cn("border-b", className)}>
                      <div className={cn("mx-px mt-px px-3 pb-12 pt-2 text-sm leading-5", className)}>{buttonContent}</div>
                    </div>
                  </div>
                </div>
              )}
              {
                !showComment ?
                  <textarea
                    className={cn("pl-1.5", (textAreaVariants({ variant, textareavariant })))}
                    placeholder={placeholder}
                    ref={ref}
                    {...props}

                  />
                  : null
              }
              {
                hasDivider ?
                  <>
                    <div className={cn("flex flex-nowrap justify-end space-x-2 px-2 py-2 sm:px-3", className)}>
                      <div className={cn("flex-shrink-0")}>
                        <div className={cn("relative", className)}>
                          <button className={cn("relative inline-flex items-center whitespace-nowrap rounded-full px-2 py-2 text-sm font-medium sm:px-3")} onClick={memoizedToggleListVisibility}>
                            {selectedOption ? (
                              <>
                                <img src={selectedOption.image} className={cn("inline-block flex-shrink-0 rounded-full h-5 w-5", `${imageStyle}`, className)} />
                                <span className={cn("ml-3 block truncate font-medium", className)}>{selectedOption.label}</span>
                              </>
                            ) : (
                              <>
                                {icon ? <Icon name={icon} className={cn(` h-5 w-5 text-primary/50 ${iconStyle}`, className)}/> : null}
                                <span className={cn("hidden truncate sm:ml-2 sm:block", className)}>{assignButtonName}</span>
                              </>
                            )}
                          </button>
                          {isListVisible && (
                            <ul className={cn(textAreaListVariants({}), className)}>
                              {assignList && assignList.map((option, index) => (
                                <li
                                  key={index}
                                  className={cn(" bg-white relative cursor-pointer select-none px-3 py-2", className)}
                                  onClick={() => memoizedHandleOptionClick(option)}>
                                  <div className={cn("flex items-center", className)}>
                                    <img src={option.image} className={cn("inline-block flex-shrink-0 rounded-full h-5 w-5", `${imageStyle}`, className)} />
                                    <span className={cn("ml-3 block truncate font-medium", className)}>{option.label}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      <div className={cn("flex-shrink-0", className)}>
                        <div className={cn("relative", className)}>
                          <button className={cn("relative inline-flex items-center whitespace-nowrap rounded-full px-2 py-2 text-sm font-medium sm:px-3")} onClick={memoizedToggleLabelListVisibility}>
                            {selectedLabelOption ? (
                              <>
                                <span className={cn("ml-3 block truncate font-medium", className)}>{selectedLabelOption.label}</span>
                              </>
                            ) : (
                              <>
                                {icon && <Icon name={icon} className={cn(` h-5 w-5 text-primary/50 ${iconStyle}`, className)} />}
                                <span className={cn("hidden truncate sm:ml-2 sm:block", className)}>{labelButtonName}</span>
                              </>
                            )}
                          </button>
                          {isLabelListVisible && (
                            <ul className={cn(textAreaListVariants({}), className)}>
                              {labelList && labelList.map((option, index) => (
                                <li
                                  key={index}
                                  className={cn("bg-white relative cursor-pointer select-none px-3 py-2", className)}
                                  id={`listbox-option-${index}`}
                                  role="option"
                                  onClick={() => memoizedHandleLabelOptionClick(option)}
                                >
                                  <div className={cn("flex items-center", className)}>
                                    <span className={cn("ml-3 block truncate font-medium", className)}>{option.label}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}

                        </div>
                      </div>

                      <div className={cn("flex-shrink-0", className)}>
                        <div className={cn("relative", className)}>
                          <button className={cn("relative inline-flex items-center whitespace-nowrap rounded-full px-2 py-2 text-sm font-medium sm:px-3", className)} onClick={memoizedToggleDueDateListVisibility}>
                            {selectedDueDateOption ? (
                              <>
                                <span className={cn("ml-3 block truncate font-medium", className)}>{selectedDueDateOption.label}</span>
                              </>
                            ) : (
                              <>
                                {icon ? <Icon name={icon} className={cn(`h-5 w-5 text-primary/50 ${iconStyle}`, className)} /> : null}
                                <span className={cn("hidden truncate sm:ml-2 sm:block", className)}>{dueDateButtonName}</span>
                              </>
                            )}
                          </button>
                          {isDueDateListVisible && (
                            <ul className={cn(textAreaListVariants({}), className)}>
                              {dueDateList && dueDateList.map((option, index) => (
                                <li
                                  key={index}
                                  className={cn("bg-white relative cursor-pointer select-none px-3 py-2", className)}
                                  onClick={() => memoizedHandleDueDateOptionClick(option)}
                                >
                                  <div className={cn("flex items-center", className)}>
                                    <span className={cn("ml-3 block truncate font-medium", className)}>{option.label}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}

                        </div>
                      </div>
                    </div>
                    <div className={cn("flex items-center justify-between space-x-3 border-t border-primary/20 px-2 py-2 sm:px-3", className)}>
                      <div className={cn("flex", className)}>
                        <button className={cn("group -my-2 -ml-2 inline-flex items-center rounded-full px-3 py-2 text-left text-primary/40", className)}>
                          {attachIcon ? <Icon name={attachIcon} className={cn(`h-5 w-5 text-primary/20 ${iconStyle}`, className)} /> : null}
                          <span className={cn("text-sm italic pl-2.5", className)}>{dividerText}</span>
                        </button>
                      </div>
                      <div className={cn("flex-shrink-0", className)}>
                        <button type="submit" className={cn("inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ", buttonColor(textColor), className)}>{createButton}</button>
                      </div>
                    </div>
                  </>
                  : null
              }

            </div>
            {
              submitButton &&
              <div className={cn("mt-2 flex justify-end", className)}>
                <button type="submit" className={cn("inline-flex items-center rounded-md  px-3 py-2 text-sm font-semibold shadow-sm ", buttonColor(textColor), className)}>{submitButton}</button>
              </div>}
            {
              showIconListForTextArea ?
                <>
                  <div className={cn("flex justify-between pt-2", className)}>
                    <div className={cn("flex items-center space-x-5", className)}>
                      <div className={cn("flex root", className)}>
                        <button
                          type="button" className={cn("inline-flex items-center justify-center rounded-full", className)}>
                          {attachIcon ? <Icon name={attachIcon} className={cn(`h-5 w-5 text-primary/50 ${iconStyle}`, className)} /> : null}
                        </button>
                      </div>

                      <div className={cn("flex root", className)}>
                        {
                          selectedIcon ? (
                            <>
                              <div className={cn(`${selectedIcon.bg} ${selectedIcon.height} ${selectedIcon.width} flex items-center justify-center rounded-full`, className)}>
                                <button
                                  className={cn("inline-flex items-center justify-center rounded-full", className)} onClick={memoizedHandleIconClick}>
                                  {selectedIcon.icon ? <Icon name={selectedIcon.icon} className={cn(`h-5 w-5 text-primary-foreground ${iconStyle}`, className)} /> : null}
                                </button>
                              </div>
                            </>
                          ) : <>
                            <button
                              className={cn("inline-flex items-center justify-center rounded-full", className)} onClick={memoizedHandleIconClick}>
                              {icon ? <Icon name={icon} className={cn(`h-5 w-5 text-primary/50 ${iconStyle}`, className)} /> : null}
                            </button>
                          </>
                        }


                      </div>
                    </div>

                    <div className={cn("flex-shrink-0", className)}>
                      <button type="submit" className={cn("rounded-md px-3 py-1.5 font-medium text-base leading-6 ", buttonColor(textColor), className)}>{buttonText}</button>
                    </div>
                  </div>
                  <ul className={cn(`absolute z-10 rounded-lg text-base shadow focus:outline-none text-sm`, className)}>
                    {showIcon && (
                      iconList && iconList.map((option: any, index: number) => (
                        <li key={index} className={cn(` relative bg-white cursor-default select-none px-3 py-2`, className)} >
                          <div className={cn("flex items-center", className)}>
                            <div className={cn(`${option.bg} flex ${option.height} ${option.width}  items-center justify-center rounded-full`, className)}>
                              <button onClick={() => memoizedHandleIconButtonClick(option)} >
                                {option.icon && <Icon name={option.icon} className={cn(`h-5 w-5 text-primary-foreground ${iconStyle}`, className)} />}
                              </button>
                            </div>
                            <span className={cn("ml-3 block truncate font-medium", className)}>{option.label}</span>
                          </div>
                        </li>
                      )))}
                  </ul>
                </>
                : ""
            }
          </div>
        </div >
      </>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
