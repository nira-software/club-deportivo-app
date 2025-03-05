'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { differenceInYears } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const sportTypes = [
  {
    id: 'natacion',
    label: 'Natación',
  },
  {
    id: 'aguas-abiertas',
    label: 'Aguas Abiertas',
  },
  {
    id: 'natacion-artistica',
    label: 'Natación Artística',
  },
  {
    id: 'polo-acuatico',
    label: 'Polo Acuático',
  },
  {
    id: 'clavados',
    label: 'Clavados',
  },
] as const;

const formSchema = z
  .object({
    sports: z.array(z.string()).refine((value) => value.length > 0, {
      message: 'Debes seleccionar al menos un deporte.',
    }),
    applicantName: z.string().min(2, {
      message: 'El nombre debe tener al menos 2 caracteres.',
    }),
    birthDay: z.string().refine(
      (val) => {
        const day = parseInt(val, 10);
        return day >= 1 && day <= 31;
      },
      {
        message: 'Día inválido',
      },
    ),
    birthMonth: z.string().refine(
      (val) => {
        const month = parseInt(val, 10);
        return month >= 1 && month <= 12;
      },
      {
        message: 'Mes inválido',
      },
    ),
    birthYear: z.string().refine(
      (val) => {
        const year = parseInt(val, 10);
        const currentYear = new Date().getFullYear();
        return year >= 1900 && year <= currentYear;
      },
      {
        message: 'Año inválido',
      },
    ),
    fatherName: z.string().optional(),
    motherName: z.string().optional(),
    address: z.string().min(5, {
      message: 'La dirección debe tener al menos 5 caracteres.',
    }),
    department: z.string().min(2, {
      message: 'El departamento es requerido.',
    }),
    emergencyContact: z.string().min(2, {
      message: 'El contacto de emergencia es requerido.',
    }),
    phone: z.string().min(8, {
      message: 'El teléfono debe tener al menos 8 dígitos.',
    }),
    email: z
      .string()
      .email({
        message: 'Correo electrónico inválido.',
      })
      .optional(),
  })
  .refine(
    (data) => {
      const birthDate = new Date(
        Number.parseInt(data.birthYear),
        Number.parseInt(data.birthMonth) - 1,
        Number.parseInt(data.birthDay),
      );
      const age = differenceInYears(new Date(), birthDate);
      return !(age < 18 && !data.fatherName && !data.motherName);
    },
    {
      message: 'Para menores de 18 años, se requiere el nombre de al menos uno de los padres.',
      path: ['fatherName'],
    },
  );

type FormValues = z.infer<typeof formSchema>;

export function AthleteRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [age, setAge] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sports: [],
      applicantName: '',
      birthDay: '',
      birthMonth: '',
      birthYear: '',
      fatherName: '',
      motherName: '',
      address: '',
      department: '',
      emergencyContact: '',
      phone: '',
      email: '',
    },
  });

  const watchBirthFields = form.watch(['birthDay', 'birthMonth', 'birthYear']);

  useEffect(() => {
    const [day, month, year] = watchBirthFields;
    if (day && month && year) {
      const birthDate = new Date(
        Number.parseInt(year),
        Number.parseInt(month) - 1,
        Number.parseInt(day),
      );
      const calculatedAge = differenceInYears(new Date(), birthDate);
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  }, [watchBirthFields]);

  const combineBirthDate = (day: string, month: string, year: string) => {
    if (day && month && year) {
      const date = new Date(
        Number.parseInt(year),
        Number.parseInt(month) - 1,
        Number.parseInt(day),
      );
      return isNaN(date.getTime()) ? null : date;
    }
    return null;
  };

  async function onSubmit(data: FormValues) {
    const birthDate = combineBirthDate(data.birthDay, data.birthMonth, data.birthYear);
    if (!birthDate) {
      form.setError('birthDay', { type: 'manual', message: 'Fecha de nacimiento inválida' });
      return;
    }

    const submissionData = {
      ...data,
      birthDate,
    };

    setIsSubmitting(true);

    try {
      // Aquí iría la lógica para enviar los datos al servidor
      console.log(submissionData);

      // Simulamos un retraso para mostrar el estado de carga
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: 'Inscripción enviada',
        description: 'Los datos del atleta han sido registrados correctamente.',
      });

      form.reset();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al enviar el formulario. Intente nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Inscripción de Atleta</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="sports"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Seleccione el deporte:</FormLabel>
                    <div className="grid grid-cols-2 gap-2 rounded-md border p-4 md:grid-cols-5">
                      {sportTypes.map((sport) => (
                        <div
                          key={sport.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <Checkbox
                            checked={field.value?.includes(sport.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, sport.id])
                                : field.onChange(
                                    field.value?.filter((value) => value !== sport.id),
                                  );
                            }}
                            id={`sport-${sport.id}`}
                          />
                          <label
                            htmlFor={`sport-${sport.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {sport.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="applicantName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Atleta:</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="birthDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia de nacimiento</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="DD" min="1" max="31" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mes</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione el mes" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            'Enero',
                            'Febrero',
                            'Marzo',
                            'Abril',
                            'Mayo',
                            'Junio',
                            'Julio',
                            'Agosto',
                            'Septiembre',
                            'Octubre',
                            'Noviembre',
                            'Diciembre',
                          ].map((month, index) => (
                            <SelectItem key={index} value={(index + 1).toString()}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Año</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="YYYY"
                          min="1900"
                          max={new Date().getFullYear()}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {age !== null && (
                <div className="text-sm text-muted-foreground">
                  Edad calculada: {age} años
                  {age < 18 && (
                    <span className="ml-2 text-red-500">
                      (Se requiere el nombre de al menos uno de los padres)
                    </span>
                  )}
                </div>
              )}

              <FormField
                control={form.control}
                name="fatherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del padre:</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre completo del padre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la madre:</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre completo de la madre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección de residencia:</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Dirección completa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento y municipio:</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: San Salvador, San Salvador Norte" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>En caso de emergencia llamar a:</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Padre, Madre, Tío" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono:</FormLabel>
                    <FormControl>
                      <Input placeholder="Número de teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email:</FormLabel>
                    <FormControl>
                      <Input placeholder="correo@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar inscripción'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
