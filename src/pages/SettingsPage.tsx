import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger, usePopover } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/sonner';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useTheme } from '@/lib/theme';

const languages = ['English', 'French', 'German', 'Spanish', 'Portuguese', 'Russian', 'Japanese', 'Korean', 'Chinese'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** shadcn's Date Picker pattern: a Calendar in a Popover. */
function DatePicker({ value, onChange }: { value?: Date; onChange: (date: Date) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-56 justify-start text-left">
          {value ? `${MONTHS[value.getMonth()]} ${value.getDate()}, ${value.getFullYear()}` : 'Pick a date'}
        </Button>
      </PopoverTrigger>
      <DatePickerContent value={value} onChange={onChange} />
    </Popover>
  );
}

function DatePickerContent({ value, onChange }: { value?: Date; onChange: (date: Date) => void }) {
  const { setOpen } = usePopover();
  return (
    <PopoverContent className="w-auto p-0">
      <Calendar
        selected={value}
        onSelect={(date) => {
          onChange(date);
          setOpen(false);
        }}
        disabled={(date) => date > new Date()}
      />
    </PopoverContent>
  );
}

/** shadcn's Combobox pattern: a searchable Command in a Popover. */
function LanguagePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-56 justify-between text-left">
          {value || 'Select language'} ▾
        </Button>
      </PopoverTrigger>
      <LanguagePickerContent value={value} onChange={onChange} />
    </Popover>
  );
}

function LanguagePickerContent({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { setOpen } = usePopover();
  return (
    <PopoverContent className="w-56 p-0">
      <Command>
        <CommandInput placeholder="Search language…" />
        <CommandList>
          <CommandEmpty>No language found.</CommandEmpty>
          <CommandGroup>
            {languages.map((language) => (
              <CommandItem
                key={language}
                value={language}
                onSelect={(selected) => {
                  onChange(selected);
                  setOpen(false);
                }}
              >
                {language}
                {language === value && <span className="text-sm text-popover-foreground">✓</span>}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  );
}

export function SettingsPage() {
  const { appearance, setAppearance } = useTheme();
  const [name, setName] = useState('Pedro Duarte');
  const [email, setEmail] = useState('pedro@example.com');
  const [birthday, setBirthday] = useState<Date | undefined>();
  const [language, setLanguage] = useState('English');
  const emailError = email.includes('@') ? undefined : 'Enter a valid email address.';

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>This is how others will see you.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              <FieldDescription>Your public display name.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <FieldError>{emailError}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Bio</FieldLabel>
              <Textarea placeholder="Tell us a little bit about yourself" />
            </Field>
            <Field>
              <FieldLabel>Date of birth</FieldLabel>
              <DatePicker value={birthday} onChange={setBirthday} />
              <FieldDescription>Used to calculate your age.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Language</FieldLabel>
              <LanguagePicker value={language} onChange={setLanguage} />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button disabled={!!emailError} onClick={() => toast.success('Profile updated')}>
            Update profile
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what we email you about.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <RadioGroup defaultValue="mentions">
              {[
                ['all', 'All new messages'],
                ['mentions', 'Direct messages and mentions'],
                ['none', 'Nothing'],
              ].map(([value, label]) => (
                <Field key={value} orientation="horizontal">
                  <RadioGroupItem value={value} id={`notify-${value}`} />
                  <FieldLabel htmlFor={`notify-${value}`}>{label}</FieldLabel>
                </Field>
              ))}
            </RadioGroup>
            <FieldSeparator />
            {[
              ['Communication emails', 'Receive emails about your account activity.', false],
              ['Marketing emails', 'Receive emails about new products and features.', false],
              ['Security emails', 'Receive emails about your account security.', true],
            ].map(([title, description, on]) => (
              <Field key={title as string} orientation="horizontal">
                <FieldContent>
                  <FieldLabel>{title}</FieldLabel>
                  <FieldDescription>{description}</FieldDescription>
                </FieldContent>
                <Switch defaultChecked={on as boolean} />
              </Field>
            ))}
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Override the system theme.</CardDescription>
        </CardHeader>
        <CardContent>
          <ToggleGroup
            type="single"
            variant="outline"
            value={appearance}
            onValueChange={(value) => value && setAppearance(value as 'light' | 'dark')}
          >
            <ToggleGroupItem value="light">☀ Light</ToggleGroupItem>
            <ToggleGroupItem value="dark">☾ Dark</ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>
    </>
  );
}
