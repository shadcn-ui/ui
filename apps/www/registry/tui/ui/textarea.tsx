import React, { useState, useCallback } from 'react';
import { cva, type VariantProps, } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Icon, IconType } from "./icon"
import { Input } from './input';


const textAreaVariants = cva(
  "block w-full rounded-md border-0 py-1.5 pl-3  ring-1 ring-inset focus:ring-2 focus:ring-inset ",
  {
    variants: {
      variant: {
        outline:
          "border border-input placeholder:text-gray focus:ring-0 ring-0 "

      },
      size: {
        xs: "text-xs leading-4 ",
        sm: "text-sm leading-5 ",
        default: "text-base leading-6 ",
        lg: "text-lg leading-7 ",
        xl: "text-xl leading-8 "
      },
      textareavariant: {
        default: "resize-none p-0 pb-2 ring-0 focus:ring-0 border-b-4 ",
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

const textAreaImageVariants = cva(
  "  flex-shrink-0 rounded-full",
  {
    variants: {

      size: {
        xs: "h-3 w-3 rounded-full ",
        sm: "h-4 w-4 rounded-full ",
        default: "h-5 w-5 rounded-full ",
        lg: "h-6 w-6 rounded-full ",
        xl: "h-7 w-7 rounded-full "
      },

    },
    defaultVariants: {
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
interface IconButton {
  bg?: string;
  label?: string;
  icon?: string;
  height?: string;
  width?: string;
}
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  VariantProps<typeof textAreaVariants> {
  asChild?: boolean;
  label?: string | undefined;
  image?: string | undefined;
  showIconForTextArea?: boolean | undefined;
  writeButton?: string | undefined;
  previewButton?: string | undefined;
  submitButton?: string | undefined;
  showMoodButton?: 'default' | "resultButton";
  textAreaButtonvariant?: "outline" | "gray";
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
  attachFileName?: string | undefined;
  iconButton?: IconButton[] | undefined;
  previewContent?: string | undefined;
  createButton?: string | undefined;
  iconStyle?: string | undefined;
  widthForUl?:string | undefined;
  submitButtonName?: string | undefined;
  color?: "black" | "white" | "slate" | "gray" | "zinc" | "neutral" | "stone" |
  "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan"
  | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose";
}


const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, showIconForTextArea,widthForUl, color, submitButtonName, iconButton, iconStyle, createButton, attachFileName, previewContent, labelList, attachIcon, dueDateList, dueDateButtonName, assignList, labelButtonName, assignButtonName, hasDivider, titlePlaceholder, icon, variant, icons, textareavariant, placeholder, showMoodButton, textAreaButtonvariant, previewButton, submitButton, writeButton, label, ...props }, ref) => {
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


    const buttonColor = (color?: string) => {
      return ` bg-${color}-600 text-white`
    }

    const handleCommentButtonClick = () => {
      memoizedSetShowComment(true);
      memoizedSetShowWrite(false);
    };

    const handleWriteButtonClick = () => {
      memoizedSetShowWrite(true);
      memoizedSetShowComment(false);
    };
    const handleIconClick = () => {
      setShowIcon(prev => !prev);
    };
    const handleIconButtonClick = (icon: any) => {
      memoizedSetSelectedIcon(icon);
      handleIconClick();

    }
    const toggleListVisibility = () => {
      setIsListVisible(prev => !prev);
      setIsLabelListVisible(false);
      setIsDueDateListVisible(false);
    }

    const handleOptionClick = (option: any) => {
      memoizedSetSelectedOption(option);
      toggleListVisibility();
    }

    const toggleLabelListVisibility = () => {
      setIsLabelListVisible(prev => !prev);
      setIsListVisible(false);
      setIsDueDateListVisible(false);
    }
    const handleLabelOptionClick = (option: any) => {
      memoizedSetSelectedLabelOption(option);
      toggleLabelListVisibility();
    }

    const toggleDueDateListVisibility = () => {
      setIsDueDateListVisible(prev => !prev);
      setIsListVisible(false);
      setIsLabelListVisible(false);
    }

    const handleDueDateOptionClick = (option: any) => {
      memoizedSetSelectedDueDateOption(option);
      toggleDueDateListVisibility();
    }

    return (
      <>
        <div className={cn("flex items-start space-x-4", className)}>
          {
            props.image ?
              <div className={cn("flex-shrink-0")}>
                <img className={cn("inline-block", (textAreaImageVariants({})), className)} src={props.image} />
              </div>
              : ""
          }
          <div className={cn("min-w-0 flex-1", className)}>
            {
              writeButton ?
                <div className={cn("flex items-center", className)}>
                  <button
                    className={cn(textAreaButtonVariants({}))}
                    onClick={handleWriteButtonClick}>
                    {writeButton}
                  </button>

                  <button
                    className={cn(textAreaButtonVariants({}))}
                    onClick={handleCommentButtonClick}>
                    {previewButton}
                  </button>

                  <div className={cn("ml-auto flex items-center space-x-5", className)}>

                    {showWrite && (
                      <div className={cn("ml-auto flex items-center space-x-5", className)}>
                        {icons && icons.map((icon: IconType, index: number) => (
                          <div key={index} className={cn("flex items-center", className)}>
                            <button
                              className={cn("inline-flex items-center justify-center rounded-full", className)} >
                              <Icon name={icon} className={cn(`${iconStyle}`, className)} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                : ""
            }
            {label ? <label className={cn("block leading-6 text-base", className)}>{label}</label> : ''}
            <div className={cn(" rounded-lg border shadow-sm", className)}>
              {titlePlaceholder ? <Input className={cn("block border-0 shadow-none text-lg font-medium", className)} placeholder={titlePlaceholder} /> : null}
              {showComment && (
                <div className={cn("mt-2", className)}>
                  <div className={cn(" rounded-lg p-0.5", className)}>
                    <div className={cn("border-b", className)}>
                      <div className={cn("mx-px mt-px px-3 pb-12 pt-2 text-sm leading-5", className)}>{previewContent}</div>
                    </div>
                  </div>
                </div>
              )}
              {
                !showComment ?
                  <textarea
                    className={cn("pl-1.5",(textAreaVariants({ variant, textareavariant })))}
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
                          <button className={cn("relative inline-flex items-center whitespace-nowrap rounded-full px-2 py-2 text-sm font-medium sm:px-3")} onClick={toggleListVisibility}>
                            {selectedOption ? (
                              <>
                                <img src={selectedOption.image} className={cn(textAreaImageVariants({}), className)} />
                                <span className={cn("ml-3 block truncate font-medium", className)}>{selectedOption.label}</span>
                              </>
                            ) : (
                              <>
                                {icon ? <Icon name={icon} className={cn(`${iconStyle}`, className)} /> : null}
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
                                  onClick={() => handleOptionClick(option)}>
                                  <div className={cn("flex items-center", className)}>
                                    <img src={option.image} className={cn(textAreaImageVariants({}), className)} />
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
                          <button className={cn("relative inline-flex items-center whitespace-nowrap rounded-full px-2 py-2 text-sm font-medium sm:px-3")} onClick={toggleLabelListVisibility}>
                            {selectedLabelOption ? (
                              <>
                                <span className={cn("ml-3 block truncate font-medium", className)}>{selectedLabelOption.label}</span>
                              </>
                            ) : (
                              <>
                                {icon ? <Icon name={icon} className={cn(`${iconStyle}`,className)} /> : null}
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
                                  onClick={() => handleLabelOptionClick(option)}
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
                          <button className={cn("relative inline-flex items-center whitespace-nowrap rounded-full px-2 py-2 text-sm font-medium sm:px-3", className)} onClick={toggleDueDateListVisibility}>
                            {selectedDueDateOption ? (
                              <>
                                <span className={cn("ml-3 block truncate font-medium", className)}>{selectedDueDateOption.label}</span>
                              </>
                            ) : (
                              <>
                                {icon ? <Icon name={icon} className={cn(`${iconStyle}`, className)} /> : null}
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
                                  onClick={() => handleDueDateOptionClick(option)}
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
                    <div className={cn("flex items-center justify-between space-x-3 border-t border-gray-200 px-2 py-2 sm:px-3", className)}>
                      <div className={cn("flex", className)}>
                        <button className={cn("group -my-2 -ml-2 inline-flex items-center rounded-full px-3 py-2 text-left text-gray-400", className)}>
                          {attachIcon ? <Icon name={attachIcon} className={cn(`${iconStyle}`, className)} /> : null}
                          <span className={cn("text-sm italic", className)}>{attachFileName}</span>
                        </button>
                      </div>
                      <div className={cn("flex-shrink-0", className)}>
                        <button type="submit" className={cn("inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ",buttonColor(color), className)}>{createButton}</button>
                      </div>
                    </div>
                  </>
                  : null
              }

            </div>
            {
              submitButton ?
                <div className={cn("mt-2 flex justify-end", className)}>
                  <button type="submit" className={cn("inline-flex items-center rounded-md  px-3 py-2 text-sm font-semibold shadow-sm ",buttonColor(color), className)}>{submitButton}</button>
                </div> : ""
            }
            {
              showIconForTextArea ?
                <>
                  <div className={cn("flex justify-between pt-2", className)}>
                    <div className={cn("flex items-center space-x-5", className)}>
                      <div className={cn("flex root", className)}>
                        <button
                          type="button" className={cn("inline-flex items-center justify-center rounded-full", className)}>
                          {attachIcon ? <Icon name={attachIcon} className={cn(`${iconStyle}`, className)} /> : null}
                        </button>
                      </div>

                      <div className={cn("flex root", className)}>
                        {
                          selectedIcon ? (
                            <>
                              <div className={cn(`${selectedIcon.bg} ${selectedIcon.height} ${selectedIcon.width} flex items-center justify-center rounded-full`, className)}>
                                <button
                                  className={cn("inline-flex items-center justify-center rounded-full", className)} onClick={handleIconClick}>
                                  {selectedIcon.icon ? <Icon name={selectedIcon.icon} /> : null}
                                </button>
                              </div>
                            </>
                          ) : <>
                            <button
                              className={cn("inline-flex items-center justify-center rounded-full", className)} onClick={handleIconClick}>
                              {icon ? <Icon name={icon} className={cn(`${iconStyle}`, className)} /> : null}
                            </button>
                          </>
                        }


                      </div>
                    </div>

                    <div className={cn("flex-shrink-0", className)}>
                      <button type="submit" className={cn("rounded-md px-3 py-1.5 font-medium text-base leading-6 ",buttonColor(color),className)}>{submitButtonName}</button>
                    </div>
                  </div>
                  <ul className={cn(`absolute z-10 ${widthForUl} rounded-lg text-base shadow focus:outline-none text-sm`, className)}>
                    {showIcon && (
                      iconButton && iconButton.map((option: any, index: number) => (
                        <li key={index} className={cn(` relative bg-white cursor-default select-none px-3 py-2`, className)} >
                          <div className={cn("flex items-center", className)}>
                            <div className={cn(`${option.bg} flex ${option.height} ${option.width}  items-center justify-center rounded-full`, className)}>
                              <button onClick={() => handleIconButtonClick(option)} >
                                <Icon name={option.icon} className={cn(`${iconStyle}`, className)} />
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
