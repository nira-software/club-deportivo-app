'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

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

const formSchema = z.object({
  sports: z.array(z.string()).refine((value) => value.length > 0, {
    message: 'Debes seleccionar al menos un deporte.',
  }),
  applicantName: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  birthDate: z.date({
    required_error: 'La fecha de nacimiento es requerida.',
  }),
  fatherName: z.string().min(2, {
    message: 'El nombre del padre debe tener al menos 2 caracteres.',
  }),
  motherName: z.string().min(2, {
    message: 'El nombre de la madre debe tener al menos 2 caracteres.',
  }),
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
  email: z.string().email({
    message: 'Correo electrónico inválido.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function AthleteRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sports: [],
      applicantName: '',
      fatherName: '',
      motherName: '',
      address: '',
      department: '',
      emergencyContact: '',
      phone: '',
      email: '',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);

    try {
      // Aquí iría la lógica para enviar los datos al servidor
      console.log(data);

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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Nacimiento:</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MMMM/yyyy', { locale: es })
                            ) : (
                              <span>Seleccione una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
